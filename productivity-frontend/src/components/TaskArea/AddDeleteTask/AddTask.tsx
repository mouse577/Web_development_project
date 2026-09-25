import { useEffect, useState } from 'react';
import usePostPutPatchDelete from '../../../hooks/usePostPutPatchDelete';
import { PostPutPatchTaskResponse, PostTaskRequired, TaskType } from '../../../types';
import AuthService from '../../../utils/Auth';
import styles from './AddDeleteTask.module.css';

type AddTaskProps = {
  setAddingTask: (addingTask: boolean) => void;
};

const AddTask: React.FC<AddTaskProps> = ({ setAddingTask }) => {
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState<TaskType | ''>('');
  const [dueDate, setDueDate] = useState('');
  const { data, error, loading, sendRequest } = usePostPutPatchDelete<
    PostTaskRequired,
    PostPutPatchTaskResponse
  >('tasks', 'POST');

  // Automatically close 2.5s after successful creation
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => setAddingTask(false), 2500);
      return () => clearTimeout(timer); // Cleanup in case the component unmounts early
    }
  }, [data, setAddingTask]);

  const getTomorrow = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = AuthService.getUser();
    // TODO: The user ID just falls back to 0 if the user is not logged in. Eventually, the user
    // will need to be logged in anyway, so this won't be an issue.
    const id = user ? user.id : 0;
    const requestData: PostTaskRequired = {
      user_id: id,
      task_name: taskName,
      // Determining it's safe to assert that taskType is not the empty string here because the
      // select element is required
      task_type: taskType as TaskType,
      due_date: new Date(dueDate),
    };
    sendRequest(requestData);
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <form className={styles.addDeleteTaskForm} onSubmit={handleSubmit}>
          <h3>Add a new task</h3>
          <label>
            Task Name:{' '}
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label>
            Task Type:{' '}
            <select
              value={taskType}
              // Determining this is type safe because it starts as the empty string and then all
              // the options are valid TaskTypes
              onChange={(e) => setTaskType(e.target.value as TaskType | '')}
              required
            >
              <option value='' disabled>
                Select one...
              </option>
              <option value='long-term'>Long Term</option>
              <option value='short-term'>Short Term</option>
              <option value='daily'>Daily</option>
            </select>
          </label>
          <label>
            Due Date:{' '}
            <input
              type='date'
              min={getTomorrow()}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </label>
          <button type='submit'>Submit</button>
          <button type='button' onClick={() => setAddingTask(false)}>
            Cancel
          </button>
          {loading && <p>Loading...</p>}
          {error && <p>Failed to add task: {error.message}</p>}
          {data && (
            <p>
              <i>{data.message}</i>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddTask;

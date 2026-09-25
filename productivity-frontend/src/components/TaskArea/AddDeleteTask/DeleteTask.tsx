import { useEffect } from 'react';
import usePostPutPatchDelete from '../../../hooks/usePostPutPatchDelete';
import styles from './AddDeleteTask.module.css';
import { TaskData } from '../../../types';

type DeleteTaskProps = {
  task: TaskData;
  setDeletingTask: (deletingTask: boolean) => void;
  setIsDeleted: (isDeleted: boolean) => void;
};

const DeleteTask: React.FC<DeleteTaskProps> = ({ task, setDeletingTask, setIsDeleted }) => {
  const { data, error, loading, sendRequest } = usePostPutPatchDelete<
    { id: number },
    { message: string }
  >('tasks', 'DELETE');

  useEffect(() => {
    if (data) {
      setIsDeleted(true);
      // Automatically close 2.5s after successful creation
      const timer = setTimeout(() => setDeletingTask(false), 2500);
      return () => clearTimeout(timer); // Cleanup in case the component unmounts early
    }
  }, [data, setIsDeleted, setDeletingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendRequest({ id: task.id });
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <form className={styles.addDeleteTaskForm}>
          <p>Are you sure you want to delete {task.task_name}?</p>
          <button type='submit' onClick={handleSubmit}>
            Yes
          </button>
          <button type='button' onClick={() => setDeletingTask(false)}>
            Cancel
          </button>
          {loading && <p>Loading...</p>}
          {error && <p>Failed to delete task: {error.message}</p>}
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

export default DeleteTask;

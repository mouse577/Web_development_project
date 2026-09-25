import { useContext, useEffect, useState } from 'react';
import useGetRequest from '../../../hooks/useGetRequest';
import { TaskData, TaskType } from '../../../types';
import styles from './TaskList.module.css';
import TaskBox from './TaskBox';
import Spinner from 'react-bootstrap/Spinner';


import { UserContext } from '../../../pages/TaskPage/TaskPage';

type TaskListProps = {
  taskType: TaskType;
  addingTask: boolean;
};

const TaskList: React.FC<TaskListProps> = ({ taskType, addingTask }) => {

  const user = useContext(UserContext);

  const [tasks, setTasks] = useState<TaskData[] | null>(null);
  const { data, error, loading, sendRequest } = useGetRequest<TaskData[]>('tasks');
  const [showCompleted, setShowCompleted] = useState(false);

  
  // Initially get the tasks
  useEffect(() => {
    if (user) sendRequest({ task_type: taskType, user_id: String(user.id) });
    // Depend on addingTask so that the list will update when a new task is added
  }, [sendRequest, taskType, addingTask, user]);

  // Set the initial tasks to local state
  useEffect(() => {
    if (data) setTasks(data);
  }, [data, setTasks]);

  // Sort between complete and
  const incompleteTasks = tasks?.filter((task) => !task.task_complete) || [];
  const completedTasks = tasks?.filter((task) => task.task_complete) || [];

  return (
    <>
      {loading && <Spinner animation="border" variant="primary" />
      }
      {error && <p>Failed to get tasks: {error.message}</p>}
      {tasks && (
  <div className={styles.taskListDiv}>
    {/* Incomplete tasks */}
    {incompleteTasks.map((task) => (
      <TaskBox key={task.id} task={task} />
    ))}

    {/* Drawer Toggle Button */}
    {completedTasks.length > 0 && (
  <div className={styles.completedDrawerToggle}>
    <button className='btn btn-tertiary show-complete-btn' onClick={() => setShowCompleted(!showCompleted)}>
      {showCompleted ? 'Hide' : 'Show'} Completed Tasks ({completedTasks.length})
    </button>
  </div>
)}


    {/* Collapsible drawer for completed tasks */}
    {showCompleted && (
      <div className={styles.completedDrawer}>
        {completedTasks.map((task) => (
          <TaskBox key={task.id} task={task} />
        ))}
      </div>
    )}
  </div>
)}

    </>
  );
};

export default TaskList;

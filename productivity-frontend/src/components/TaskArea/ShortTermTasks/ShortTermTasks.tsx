import TaskList from '../TaskList/TaskList';

const ShortTermTasks: React.FC<{ addingTask: boolean }> = ({ addingTask }) => {
  return (
    <div className='flex flex-column'>
      <h3>Short-Term Tasks</h3>
      <TaskList taskType='short-term' addingTask={addingTask} />
      <hr style={{ width: '100%' }} />
      <h3>Daily Tasks</h3>
      <TaskList taskType='daily' addingTask={addingTask} />
    </div>
  );
};

export default ShortTermTasks;

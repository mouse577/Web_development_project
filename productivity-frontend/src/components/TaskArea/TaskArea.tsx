import { useState } from 'react';
import LongTermTasks from './LongTermTasks/LongTermTasks';
import ShortTermTasks from './ShortTermTasks/ShortTermTasks';
import AddTask from './AddDeleteTask/AddTask';
import Button from 'react-bootstrap/Button';

const TaskArea = () => {
  const [addingTask, setAddingTask] = useState(false);

  return (
    <div className="d-flex flex-column w100">
      {addingTask && <AddTask setAddingTask={setAddingTask} />}
      <Button className="w-100 mb-3" type='button' onClick={() => setAddingTask(true)}>
        Add Task
      </Button>
      <LongTermTasks addingTask={addingTask} />
      <ShortTermTasks addingTask={addingTask} />
    </div>
  );
};

export default TaskArea;

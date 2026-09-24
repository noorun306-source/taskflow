import { useState } from "react";
import "./taskinput.css";

function TaskInput({ addTask }) {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const[priority, setPriority] = useState("Medium");

  const handleAdd = () => {
    if (task.trim() === "") return;

    addTask({ text: task,
         dueDate,
         priority,
         completed: false,
         });
    setTask("");
    setDueDate("");
    setPriority("Medium");
  };

  return (
    <div className="task-input">
      <input
        type="text"
        placeholder="Enter a task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <select
      value={priority}
      onChange={(e) =>
        setPriority(e.target.value)}
        >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
        </select>
      
      <button onClick={handleAdd}>Add Task</button>
    </div>
  );
}

export default TaskInput;

import { useState } from "react";
import "./taskCard.css";

function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const saveEdit = () => {
    if (editText.trim() === "") return;
    onEdit(editText);
    setIsEditing(false);
  };

  return (
    <div className="task-card">
      <div className="task-left">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
        />

        <div>
          {isEditing ? (
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <span className={task.completed ? "completed" : ""}>
              {task.text}
            </span>
          )}


          {task.dueDate && <p>📅 {task.dueDate}</p>}
       <span className={`priority ${task.priority?.toLowerCase()}`}>
          {task.priority}
            </span>
        

        </div>
      </div>

      <div className="task-actions">
        {isEditing ? (
          <button className="save-btn" onClick={saveEdit}>
            Save
          </button>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}

        <button className="delete-btn" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
import { useState, useEffect } from "react";
import "./dashboard.css";
import TaskInput from "./taskinput";
import TaskCard from "./taskcard";

function Dashboard() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      const parsedTasks = saved ? JSON.parse(saved) : [];
      return parsedTasks.map((task, index) => ({
        ...task,
        id: task.id ?? `${task.createdAt ?? "legacy"}-${index}`,
      }));
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      return saved === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: crypto.randomUUID(),
        ...newTask,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task, i) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const editTask = (taskId, newTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((task, i) =>
        task.id === taskId ? { ...task, text: newTask } : task
      )
    );
  };

  const completed = tasks.filter((task) => task.completed).length;

  const progress =  tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  const filteredTasks = tasks
    .filter((task) => {
      const taskText = task.text ?? "";
      const matchesSearch = taskText.toLowerCase().includes(search.toLowerCase());

      if (filter === "Completed") return matchesSearch && task.completed;
      if (filter === "Pending") return matchesSearch && !task.completed;

      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "Due Date") {
        const dateA = new Date(a.dueDate || "9999-12-31").getTime();
        const dateB = new Date(b.dueDate || "9999-12-31").getTime();
        return dateA - dateB;
      }

      if (sortBy === "Priority") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return (priorityOrder[b.priority] ?? 0) - (priorityOrder[a.priority] ?? 0);
      }

      return 0;
    });

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      <h1>Task Dashboard</h1>
      <p>Manage your tasks smarter</p>

      <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="cards">
        <div className="card">
          <h3>Total Tasks</h3>
          <h2>{tasks.length}</h2>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <h2>{completed}</h2>
        </div>

        <div className="card">
          <h3>Pending</h3>
          <h2>{tasks.length - completed}</h2>
        </div>
      </div>
      <div className="progress-section">
  <div className="progress-header">
    <span>Progress</span>
    <span>{progress}%</span>
  </div>

  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
</div>

      <TaskInput addTask={addTask} />

      <input
        className="search-box"
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-buttons">
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Pending")}>Pending</button>
        <button onClick={() => setFilter("Completed")}>Completed</button>
      </div>

      <select
        className="sort-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="Newest">Newest</option>
        <option value="Due Date">Due Date</option>
        <option value="Priority">Priority</option>
      </select>

      <div className="task-list">
  {filteredTasks.length === 0 ? (
    <div className="empty-state">
      <h3>No tasks found</h3>
      <p>
        {search
          ? "Try searching for another task."
          : "Add your first task to get started!"}
      </p>
    </div>
  ) : (
    filteredTasks.map((task) => (
      <TaskCard
        key={task.id}
        task={task}
        onToggle={() => toggleTask(task.id)}
        onDelete={() => deleteTask(task.id)}
        onEdit={(newText) => editTask(task.id, newText)}
      />
    ))
  )}
</div>
    </div>
  );
}

export default Dashboard;

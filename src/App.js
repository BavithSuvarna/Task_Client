import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthForm from './components/Auth/AuthForm';
import TaskItem from './components/TaskItem';

const API_URL = "https://task-server-47fa.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (isLoggedIn) fetchTasks();
  }, [isLoggedIn]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const createTask = async () => {
    if (!title) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(API_URL, { title }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, res.data]);
      setTitle("");
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  const toggleTask = async (task) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/${task._id}`, {
        completed: !task.completed,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Error toggling task", err);
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditedTitle(task.title);
  };

  const saveEdit = async (task) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/${task._id}`, {
        title: editedTitle,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
      setEditingId(null);
      setEditedTitle("");
    } catch (err) {
      console.error("Error editing task", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setTasks([]);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "Completed") return task.completed;
    if (filterStatus === "Pending") return !task.completed;
    return true;
  });

  if (!isLoggedIn) {
    return (
      <div>
        <AuthForm onAuthSuccess={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto' }}>
      <h2>Task Manager</h2>
      <button onClick={logout} style={{ marginBottom: 20 }}>Logout</button>

      <div style={{ display: 'flex', marginBottom: 20 }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          style={{
            flexGrow: 1,
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginRight: '10px'
          }}
        />
        <button onClick={createTask} style={{
          padding: '10px 15px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>Add</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        {["All", "Completed", "Pending"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            style={{
              marginRight: 10,
              fontWeight: filterStatus === status ? "bold" : "normal",
              padding: '6px 10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: filterStatus === status ? '#2196F3' : '#fff',
              color: filterStatus === status ? '#fff' : '#333'
            }}
          >
            {status}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            isEditing={editingId === task._id}
            editedTitle={editedTitle}
            setEditedTitle={setEditedTitle}
            onSave={saveEdit}
            onEdit={startEditing}
            onDelete={deleteTask}
            onToggle={toggleTask}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;

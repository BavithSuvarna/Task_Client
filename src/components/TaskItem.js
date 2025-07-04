// TaskItem.js
import React from 'react';

export default function TaskItem({
  task,
  isEditing,
  editedTitle,
  setEditedTitle,
  onSave,
  onEdit,
  onDelete,
  onToggle
}) {
  return (
    <li style={{
      backgroundColor: '#f4f4f4',
      borderRadius: '10px',
      padding: '12px',
      marginTop: '10px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task)}
          style={{ transform: 'scale(1.2)', marginRight: '10px' }}
        />

        {isEditing ? (
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            style={{
              padding: '6px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              flexGrow: 1
            }}
          />
        ) : (
          <span
            style={{
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#888' : '#222',
              fontSize: '16px'
            }}
          >
            {task.title}
          </span>
        )}
      </div>

      <div style={{ marginLeft: '10px' }}>
        {isEditing ? (
          <button onClick={() => onSave(task)} style={buttonStyle('green')}>💾</button>
        ) : (
          <button onClick={() => onEdit(task)} style={buttonStyle('blue')}>✏️</button>
        )}
        <button onClick={() => onDelete(task._id)} style={buttonStyle('red')}>❌</button>
      </div>
    </li>
  );
}

const buttonStyle = (color) => ({
  backgroundColor: color === 'green' ? '#4CAF50' :
                   color === 'blue' ? '#2196F3' :
                   '#f44336',
  color: '#fff',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '5px',
  marginLeft: '5px',
  cursor: 'pointer'
});

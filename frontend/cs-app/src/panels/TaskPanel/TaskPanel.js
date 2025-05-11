import React from 'react';
import styles from './TaskPanel.module.css';

const tasks = [
  { id: 1, name: 'Masonry', workers: 10, location: 'Sector A' },
  { id: 2, name: 'Electrical', workers: 5, location: 'Sector B' }
];

const TaskPanel = () => {
  return (
    <div className={styles.container}>
      <h3>📋 Today's Tasks</h3>
      <ul className={styles.taskList}>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.name}</span>
            <span>{task.workers} workers @ {task.location}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskPanel;

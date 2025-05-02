import React, { useState, useEffect } from 'react';
import styles from './AttendancePanel.module.css';

const AttendancePanel = () => {
  const [present, setPresent] = useState(22);
  const [total] = useState(30);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setPresent(prev => Math.min(prev + 1, total));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>👷 Attendance</h3>
      <div className={styles.count}>
        {present}/{total} Present
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${(present/total)*100}%` }}
        />
      </div>
    </div>
  );
};

export default AttendancePanel;
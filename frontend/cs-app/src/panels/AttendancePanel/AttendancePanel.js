import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AttendancePanel.module.css';

const AttendancePanel = ({ siteId = 'default-site' }) => {
  const [present, setPresent] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`/api/attendance/${siteId}`);
        setPresent(response.data.present);
        setTotal(response.data.total);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance data');
        // Fallback to default values
        setPresent(22);
        setTotal(30);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [siteId]);

  // Update attendance in backend
  const updateAttendance = async (newPresent) => {
    try {
      await axios.put(`/api/attendance/${siteId}`, {
        present: newPresent,
        total: total
      });
      setPresent(newPresent);
    } catch (err) {
      console.error('Error updating attendance:', err);
      setError('Failed to update attendance');
    }
  };

  // Simulate real-time updates (for demo)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const randomChange = Math.random() > 0.5 ? 1 : -1;
        setPresent(prev => {
          const newValue = Math.max(0, Math.min(prev + randomChange, total));
          updateAttendance(newValue); // Sync with backend
          return newValue;
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [total]);

  if (loading) return <div className={styles.container}>Loading attendance...</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>👷 Attendance</h3>
      <div className={styles.count}>
        {present}/{total} Present ({percentage}%)
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Manual controls for testing */}
      <div className={styles.controls}>
        <button 
          onClick={() => updateAttendance(Math.min(present + 1, total))}
          disabled={present >= total}
        >
          +1
        </button>
        <button 
          onClick={() => updateAttendance(Math.max(0, present - 1))}
          disabled={present <= 0}
        >
          -1
        </button>
      </div>
    </div>
  );
};

export default AttendancePanel;
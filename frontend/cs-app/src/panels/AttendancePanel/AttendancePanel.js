import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AttendancePanel.module.css';

const AttendancePanel = ({ siteId = 'default-site' }) => {
  const [attendance, setAttendance] = useState({
    present: 0,
    total: 0,
    workers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rfidInput, setRfidInput] = useState('');

  // Dummy worker data (replace with API call in production)
  const dummyWorkers = [
    { id: 'RFID001', name: 'John Doe', position: 'Mason', present: false },
    { id: 'RFID002', name: 'Jane Smith', position: 'Electrician', present: false },
    { id: 'RFID003', name: 'Mike Johnson', position: 'Plumber', present: false },
    { id: 'RFID004', name: 'Ritaal', position: 'Maid', present: false },

    
    // Add 30 more dummy workers as needed
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `RFID${100 + i}`,
      name: `Worker ${i + 4}`,
      position: ['Laborer', 'Carpenter', 'Welder'][i % 3],
      present: false
    }))
  ];

  // Fetch initial attendance data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`/api/attendance/${siteId}`);
        setAttendance({
          present: response.data.present || 0,
          total: response.data.total || dummyWorkers.length,
          workers: response.data.workers || dummyWorkers
        });
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError('Failed to load attendance data');
        // Fallback to dummy data
        setAttendance({
          present: 22,
          total: dummyWorkers.length,
          workers: dummyWorkers.map((w, i) => ({ 
            ...w, 
            present: i < 22 // First 22 marked present for demo
          }))
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [siteId]);

  // RFID scanner simulation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleRfidScan(rfidInput);
        setRfidInput('');
      } else if (/^\d$/.test(e.key)) {
        setRfidInput(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rfidInput]);

  const handleRfidScan = async (rfid) => {
    try {
      const workerIndex = attendance.workers.findIndex(w => w.id === rfid);
      if (workerIndex === -1) {
        setError(`Worker with RFID ${rfid} not found`);
        return;
      }

      const updatedWorkers = [...attendance.workers];
      const wasPresent = updatedWorkers[workerIndex].present;
      updatedWorkers[workerIndex].present = !wasPresent;

      const newPresent = wasPresent 
        ? attendance.present - 1 
        : attendance.present + 1;

      // Update backend
      await axios.put(`/api/attendance/${siteId}`, {
        present: newPresent,
        workers: updatedWorkers
      });

      setAttendance({
        present: newPresent,
        total: attendance.total,
        workers: updatedWorkers
      });
    } catch (err) {
      console.error('Error updating attendance:', err);
      setError('Failed to update attendance');
    }
  };

  const absentWorkers = attendance.workers.filter(w => !w.present);

  if (loading) return <div className={styles.container}>Loading attendance...</div>;

  const percentage = attendance.total > 0 
    ? Math.round((attendance.present / attendance.total) * 100) 
    : 0;

  return (
    <div className={styles.container}>
      {/* RFID Scanner Simulation */}
      <div className={styles.rfidScanner}>
        <h3>RFID Scanner</h3>
        <input
          type="text"
          value={rfidInput}
          onChange={(e) => setRfidInput(e.target.value)}
          placeholder="Simulate RFID scan (type digits + Enter)"
          className={styles.rfidInput}
        />
      </div>

      {/* Attendance Summary */}
      <div className={styles.summary}>
        <h3 className={styles.title}>👷 Attendance Summary</h3>
        <div className={styles.count}>
          {attendance.present}/{attendance.total} Present ({percentage}%)
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Absentees Table */}
      <div className={styles.absentTable}>
        <h3>Absent Workers ({absentWorkers.length})</h3>
        <table>
          <thead>
            <tr>
              <th>RFID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {absentWorkers.map(worker => (
              <tr key={worker.id}>
                <td>{worker.id}</td>
                <td>{worker.name}</td>
                <td>{worker.position}</td>
                <td className={styles.absent}>ABSENT</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Full Workers Table (optional) */}
      <div className={styles.fullTable}>
        <h3>All Workers</h3>
        <table>
          <thead>
            <tr>
              <th>RFID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.workers.map(worker => (
              <tr key={worker.id} className={worker.present ? styles.presentRow : styles.absentRow}>
                <td>{worker.id}</td>
                <td>{worker.name}</td>
                <td>{worker.position}</td>
                <td>{worker.present ? 'PRESENT' : 'ABSENT'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default AttendancePanel;
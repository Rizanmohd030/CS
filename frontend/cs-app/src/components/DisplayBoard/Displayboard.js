import React from 'react';
import PropTypes from 'prop-types';
import styles from './Displayboard.module.css';  // Corrected path

// Import panels with correct paths
import AttendancePanel from '../panels/AttendancePanel/AttendancePanel';
import TaskPanel from '../panels/TaskPanel/TaskPanel';
import SafetyAlerts from '../panels/SafetyAlerts/SafetyAlerts';
import ProgressTracker from '../panels/ProgressTracker/ProgressTracker';
import EmergencyProtocols from '../panels/EmergencyProtocols/EmergencyProtocols';

const DisplayBoard = ({ 
  title = 'Construction Site Dashboard',
  attendance = { present: 0, total: 0 },
  tasks = []
}) => {
  return (
    <div className={styles.displayBoard}>
      {title && <h1 className={styles.title}>{title}</h1>}
      
      <div className={styles.content}>
        <div className={styles.layout}>
          <div className={styles.topRow}>
            <AttendancePanel present={attendance.present} total={attendance.total} />
            <TaskPanel tasks={tasks} />
          </div>
          
          <div className={styles.middleRow}>
            <SafetyAlerts />
            <ProgressTracker progress={calculateProgress(tasks)} />
          </div>
          
          <div className={styles.bottomRow}>
            <EmergencyProtocols />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate overall progress
const calculateProgress = (tasks) => {
  if (!tasks.length) return 0;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  return Math.round((completed / tasks.length) * 100);
};

DisplayBoard.propTypes = {
  title: PropTypes.string,
  attendance: PropTypes.shape({
    present: PropTypes.number,
    total: PropTypes.number
  }),
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      workers: PropTypes.number,
      location: PropTypes.string,
      status: PropTypes.string
    })
  )
};

export default DisplayBoard;
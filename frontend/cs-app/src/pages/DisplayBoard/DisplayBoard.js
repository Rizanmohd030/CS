import React from 'react';
import PropTypes from 'prop-types';
import styles from './DisplayBoard.module.css';

// Panel imports with proper error boundaries
import AttendancePanel from '../../panels/AttendancePanel/AttendancePanel';
import TaskPanel from '../../panels/TaskPanel/TaskPanel';
import SafetyAlerts from '../../panels/SafetyAlerts/SafetyAlerts';
import ProgressTracker from '../../panels/ProgressTracker/ProgressTracker';
import EmergencyProtocols from '../../panels/EmergencyProtocols/EmergencyProtocols';

const DisplayBoard = ({ 
  title = 'Construction Site Dashboard',
  attendance = { present: 0, total: 0 },
  tasks = [],
  alerts = [],
  // New props for direct panel control
  onTaskClick,
  onAlertClick,
  onEmergencyProtocolClick
}) => {
  // Enhanced progress calculation
  const calculateProgress = (tasks) => {
    if (!tasks?.length) return 0;
    const statusWeights = {
      'Completed': 1,
      'In Progress': 0.5,
      'Not Started': 0
    };
    const totalWeight = tasks.reduce((sum, task) => {
      return sum + (statusWeights[task.status] || 0);
    }, 0);
    return Math.round((totalWeight / tasks.length) * 100);
  };

  return (
    <div className={styles.displayBoard}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.attendanceBadge}>
          <span className={styles.presentCount}>{attendance.present}</span>
          <span className={styles.totalCount}>/{attendance.total}</span>
          <span className={styles.badgeLabel}>Workers Present</span>
        </div>
      </header>

      <div className={styles.panelGrid}>
        {/* Top Row */}
        <div className={`${styles.panelContainer} ${styles.topRow}`}>
          <div className={styles.panelWrapper}>
            <TaskPanel 
              tasks={tasks} 
              onTaskClick={onTaskClick}
            />
          </div>
          <div className={styles.panelWrapper}>
            <SafetyAlerts 
              alerts={alerts}
              onAlertClick={onAlertClick} 
            />
          </div>
        </div>

        {/* Middle Row */}
        <div className={`${styles.panelContainer} ${styles.middleRow}`}>
          <div className={styles.panelWrapper}>
            <ProgressTracker 
              progress={calculateProgress(tasks)}
              tasks={tasks}
            />
          </div>
          <div className={styles.panelWrapper}>
            <AttendancePanel 
              present={attendance.present}
              total={attendance.total}
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div className={`${styles.panelContainer} ${styles.bottomRow}`}>
          <div className={styles.fullWidthPanel}>
            <EmergencyProtocols 
              onProtocolClick={onEmergencyProtocolClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

DisplayBoard.propTypes = {
  title: PropTypes.string,
  attendance: PropTypes.shape({
    present: PropTypes.number,
    total: PropTypes.number
  }),
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      workers: PropTypes.number,
      location: PropTypes.string,
      status: PropTypes.oneOf(['Not Started', 'In Progress', 'Completed'])
    })
  ),
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      message: PropTypes.string.isRequired,
      severity: PropTypes.oneOf(['low', 'medium', 'high'])
    })
  ),
  onTaskClick: PropTypes.func,
  onAlertClick: PropTypes.func,
  onEmergencyProtocolClick: PropTypes.func
};

DisplayBoard.defaultProps = {
  onTaskClick: (task) => console.log('Task clicked:', task),
  onAlertClick: (alert) => console.log('Alert clicked:', alert),
  onEmergencyProtocolClick: () => console.log('Emergency protocol activated')
};

export default DisplayBoard;
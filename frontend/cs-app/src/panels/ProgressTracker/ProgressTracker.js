import React, { useState } from 'react';
import styles from './ProgressTracker.module.css';

const ProgressTracker = () => {
  const [progress, setProgress] = useState(65);

  return (
    <div className={styles.container}>
      <h3>📈 Project Progress</h3>
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar}
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
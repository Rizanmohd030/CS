import React, { useState } from 'react';
import styles from './EmergencyProtocols.module.css';

const EmergencyProtocols = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`${styles.container} ${isActive ? styles.active : ''}`}>
      <button 
        className={styles.triggerButton}
        onClick={() => setIsActive(!isActive)}
      >
        🚨 EMERGENCY PROTOCOLS
      </button>
      
      {isActive && (
        <div className={styles.protocols}>
          <h4>Emergency Procedures</h4>
          <ol>
            <li>Evacuate via marked exits</li>
            <li>Assemble at parking lot B</li>
            <li>Do not use elevators</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default EmergencyProtocols;
import React, { useState, useEffect } from 'react';
import styles from './SafetyAlerts.module.css';

const alerts = [
  "⚠️ Wear hard hats in all zones",
  "🚧 Check harnesses before climbing",
  "🚨 Emergency exits must remain clear"
];

const SafetyAlerts = () => {
  const [currentAlert, setCurrentAlert] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert(prev => (prev + 1) % alerts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h3>🚨 Safety Alerts</h3>
      <div className={styles.alert}>
        {alerts[currentAlert]}
      </div>
    </div>
  );
};

export default SafetyAlerts;

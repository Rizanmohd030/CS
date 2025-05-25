import React from 'react';
import './ErrorScreen.module.css';

const ErrorScreen = ({ error, onRetry }) => {
  return (
    <div className="error-screen">
      <div className="error-content">
        <h2 className="error-title">Construction Dashboard Error</h2>
        <p className="error-message">{error || 'Unknown error occurred'}</p>
        <button className="retry-button" onClick={onRetry}>
          Retry Connection
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;
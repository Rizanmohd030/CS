import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import './index.css';// Export all components
export { default as ErrorScreen } from './components/ErrorScreen/ErrorScreen';
export { default as LoadingScreen } from './components/LoadingScreen/LoadingScreen';

// Export all panels
export { default as AttendancePanel } from './panels/AttendancePanel/AttendancePanel';
export { default as EmergencyProtocols } from './panels/EmergencyProtocols/EmergencyProtocols';
export { default as ProgressTracker } from './panels/ProgressTracker/ProgressTracker';
export { default as SafetyAlerts } from './panels/SafetyAlerts/SafetyAlerts';
export { default as TaskPanel } from './panels/TaskPanel/TaskPanel';

// Export pages
export { default as Home } from './pages/Home/Home';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-fallback">
        <h1>Something went wrong</h1>
        <button onClick={() => window.location.reload()}>Refresh</button>
      </div>;
    }
    return this.props.children;
  }
}

// Global error handler
const handleGlobalErrors = (event) => {
  // Mute WebSocket and chunk loading errors
  if (
    event.message.includes('WebSocket') || 
    event.message.includes('Loading chunk') ||
    event.error?.message?.includes('WebSocket')
  ) {
    event.preventDefault();
    return;
  }
  
  // Log other errors
  console.error('Global error:', event.error || event.message);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Register global error handlers
window.addEventListener('error', handleGlobalErrors);
window.addEventListener('unhandledrejection', handleGlobalErrors);

// Performance monitoring
// reportWebVitals(console.log);
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// // import reportWebVitals from './reportWebVitals';
// import './index.css';// Export all components
// export { default as ErrorScreen } from './components/ErrorScreen/ErrorScreen';
// export { default as LoadingScreen } from './components/LoadingScreen/LoadingScreen';

// // Export all panels
// export { default as AttendancePanel } from './panels/AttendancePanel/AttendancePanel';
// export { default as EmergencyProtocols } from './panels/EmergencyProtocols/EmergencyProtocols';
// export { default as ProgressTracker } from './panels/ProgressTracker/ProgressTracker';
// export { default as SafetyAlerts } from './panels/SafetyAlerts/SafetyAlerts';
// export { default as TaskPanel } from './panels/TaskPanel/TaskPanel';

// // Export pages
// export { default as Home } from './pages/Home/Home';

// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('Uncaught error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <div className="error-fallback">
//         <h1>Something went wrong</h1>
//         <button onClick={() => window.location.reload()}>Refresh</button>
//       </div>;
//     }
//     return this.props.children;
//   }
// }

// // Global error handler
// const handleGlobalErrors = (event) => {
//   // Mute WebSocket and chunk loading errors
//   if (
//     event.message.includes('WebSocket') || 
//     event.message.includes('Loading chunk') ||
//     event.error?.message?.includes('WebSocket')
//   ) {
//     event.preventDefault();
//     return;
//   }
  
//   // Log other errors
//   console.error('Global error:', event.error || event.message);
// };

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <ErrorBoundary>
//       <App />
//     </ErrorBoundary>
//   </React.StrictMode>
// );

// // Register global error handlers
// window.addEventListener('error', handleGlobalErrors);
// window.addEventListener('unhandledrejection', handleGlobalErrors);

// // Performance monitoring
// // reportWebVitals(console.log);

// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // <--- IMPORT BrowserRouter
import AppWrapper from './App'; // Import AppWrapper (which now exports App)
import './index.css';

// Remove the exports for components, panels, and pages from here.
// These exports are usually defined in dedicated barrel files (e.g., components/index.js, pages/index.js)
// if you intend to group them for easier imports elsewhere.
// Keeping them here makes index.js less readable and serves no clear purpose for the app's bootstapping.

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
      return (
        <div className="error-fallback">
          <h1>Something went wrong</h1>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Global error handler (keep this, it's good practice)
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
      {/* The BrowserRouter (aliased as Router) must wrap your entire application */}
      <Router>
        <AppWrapper /> {/* Render your AppWrapper here */}
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);

// Register global error handlers
window.addEventListener('error', handleGlobalErrors);
window.addEventListener('unhandledrejection', handleGlobalErrors);
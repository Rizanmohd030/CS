// src/App.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';
import ErrorScreen from './components/ErrorScreen/ErrorScreen';
import { AuthProvider } from './hooks/useAuth'; // Ensure this path is correct
import AppRoutes from './routes/Router'; // Renamed import to avoid conflict with BrowserRouter alias

function App() {
  const [dbStatus, setDbStatus] = useState('checking');
  const [constructionData, setConstructionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch health check and construction data
        const [healthCheckResponse, dataResponse] = await Promise.all([
          axios.get('/api/health'),
          axios.get('/api/construction-data')
        ]);

        setDbStatus(healthCheckResponse.data.connected ? 'connected' : 'disconnected');
        setConstructionData(dataResponse.data);
      } catch (err) {
        console.error('Data fetching failed:', err);
        setDbStatus('error');
        setError(err.message || 'Failed to load application data');

        // IMPORTANT: If API fails, make sure your router/components can handle null data
        // For development, providing demo data is fine:
        setConstructionData({
          currentWorkers: 18,
          totalWorkers: 30,
          tasks: [],
          alerts: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <LoadingScreen />;
  }

  // Only show ErrorScreen if there's an error AND no data fallback was loaded
  if (error && !constructionData) {
    return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;
  }

  // Now, render AuthProvider here, and then your AppRoutes
  // This ensures that all components rendered by AppRoutes have access to the AuthContext
  return (
    <AuthProvider>
      <AppRoutes
        dbStatus={dbStatus}
        constructionData={constructionData}
      />
    </AuthProvider>
  );
}

export default App; // Export App directly
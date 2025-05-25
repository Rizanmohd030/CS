import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './pages/Home/Home';
import LoadingScreen from './components/LoadingScreen/LoadingScreen'; // Add this import
import ErrorScreen from './components/ErrorScreen/ErrorScreen';     // Add this import

function App() {
  const [dbStatus, setDbStatus] = useState('checking');
  const [constructionData, setConstructionData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [healthCheck, dataResponse] = await Promise.all([
          axios.get('/api/health'),
          axios.get('/api/construction-data')
        ]);

        setDbStatus(healthCheck.data.connected ? 'connected' : 'disconnected');
        setConstructionData(dataResponse.data);
      } catch (err) {
        console.error('Data fetching failed:', err);
        setDbStatus('error');
        setError(err.message || 'Failed to load application data');
        
        // Use demo data if API fails
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

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleLogin = () => {
    setUser({ name: "Admin User", role: "Manager" });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error && !constructionData) {
    return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <Home 
      dbStatus={dbStatus}
      constructionData={constructionData}
      user={user}
      onLogin={handleLogin}
      onLogout={handleLogout}
    />
  );
}

export default App;
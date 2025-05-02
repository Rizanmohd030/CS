import React, { useEffect, useState } from 'react';
import DisplayBoard from "./components/DisplayBoard/Displayboard";
import axios from 'axios';
import './App.css';

// Corrected imports based on your structure
import AttendancePanel from './components/panels/AttendancePanel/AttendancePanel';
import TaskPanel from './components/panels/TaskPanel/TaskPanel';
import SafetyAlerts from './components/panels/SafetyAlerts/SafetyAlerts';
import ProgressTracker from './components/panels/ProgressTracker/ProgressTracker';
import EmergencyProtocols from './components/panels/EmergencyProtocols/EmergencyProtocols';

function App() {
  const [dbStatus, setDbStatus] = useState('checking');
  const [constructionData, setConstructionData] = useState(null);

  useEffect(() => {
    const checkDbConnection = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health');
        setDbStatus(response.data.connected ? 'connected' : 'disconnected');
        
        const dataResponse = await axios.get('http://localhost:5000/api/construction-data');
        setConstructionData(dataResponse.data);
      } catch (error) {
        setDbStatus('error');
        console.error('DB connection error:', error);
      }
    };

    checkDbConnection();
    const interval = setInterval(checkDbConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      {dbStatus === 'connected' ? (
        <DisplayBoard 
          title="Construction Site Dashboard"
          attendance={{
            present: constructionData?.currentWorkers || 0,
            total: constructionData?.totalWorkers || 0
          }}
          tasks={constructionData?.tasks || []}
          alerts={constructionData?.alerts || []}
        />
      ) : (
        <div className="db-status">
          {dbStatus === 'checking' && <p>🔃 Connecting to database...</p>}
          {dbStatus === 'disconnected' && <p>❌ Database disconnected</p>}
          {dbStatus === 'error' && <p>⚠️ Backend service unavailable</p>}
          <DisplayBoard 
            title="DEMO MODE: Construction Site Dashboard"
            attendance={{
              present: DEMO_DATA.currentWorkers,
              total: DEMO_DATA.totalWorkers
            }}
            tasks={DEMO_DATA.tasks}
            alerts={DEMO_DATA.alerts}
          />
        </div>
      )}
    </div>
  );
}

const DEMO_DATA = {
  currentWorkers: 18,
  totalWorkers: 30,
  tasks: [
    { id: 1, name: 'Foundation Work', workers: 8, location: 'North Site', status: 'In Progress' },
    { id: 2, name: 'Electrical Wiring', workers: 5, location: 'East Wing', status: 'Not Started' },
    { id: 3, name: 'Safety Inspection', workers: 2, location: 'All Areas', status: 'Completed' }
  ],
  alerts: [
    "Hard hats required in all zones",
    "New safety protocols effective Monday"
  ]
};

export default App;
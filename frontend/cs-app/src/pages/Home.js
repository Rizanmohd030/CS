import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUser, FiLogIn, FiMenu, FiX, FiHome, FiUsers, FiCalendar, FiAlertTriangle, FiSettings, FiMail } from 'react-icons/fi';
import DisplayBoard from "../components/DisplayBoard/Displayboard";
import AttendancePanel from '../components/panels/AttendancePanel/AttendancePanel';
import TaskPanel from '../components/panels/TaskPanel/TaskPanel';
import SafetyAlerts from '../components/panels/SafetyAlerts/SafetyAlerts';
import ProgressTracker from '../components/panels/ProgressTracker/ProgressTracker';
import EmergencyProtocols from '../components/panels/EmergencyProtocols/EmergencyProtocols';
import './Home.module.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
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

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({ name: "Admin User", role: "Manager" });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const menuItems = [
    { id: 'dashboard', icon: <FiHome />, label: 'Dashboard' },
    { id: 'attendance', icon: <FiUsers />, label: 'Attendance' },
    { id: 'tasks', icon: <FiCalendar />, label: 'Task Management' },
    { id: 'safety', icon: <FiAlertTriangle />, label: 'Safety Alerts' },
    { id: 'progress', icon: <FiCalendar />, label: 'Progress Tracker' },
    { id: 'emergency', icon: <FiAlertTriangle />, label: 'Emergency Protocols' },
    { id: 'profile', icon: <FiUser />, label: 'My Profile' },
    { id: 'contact', icon: <FiMail />, label: 'Contact Us' },
    { id: 'settings', icon: <FiSettings />, label: 'Settings' }
  ];

  const demoData = {
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

  const data = dbStatus === 'connected' ? constructionData : demoData;

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <button 
            className="menu-button" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h1 className="app-title">ConstructAI</h1>
        </div>
        
        <div className="navbar-right">
          {!isLoggedIn ? (
            <>
              <button className="auth-button" onClick={handleLogin}>
                <FiLogIn /> Login
              </button>
              <button className="auth-button">
                <FiUser /> Sign Up
              </button>
            </>
          ) : (
            <div className="user-profile">
              <span>Hello, {user?.name}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="content-wrapper">
        {/* Sidebar */}
        <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
          <ul className="menu-list">
            {menuItems.map(item => (
              <li key={item.id}>
                <button 
                  className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Panel Content */}
        <main className="main-content">
          {activeTab === 'dashboard' && (
            <DisplayBoard 
              title="Construction Site Dashboard"
              attendance={{
                present: data?.currentWorkers || 0,
                total: data?.totalWorkers || 0
              }}
              tasks={data?.tasks || []}
              alerts={data?.alerts || []}
            />
          )}
          {activeTab === 'attendance' && <AttendancePanel data={data} />}
          {activeTab === 'tasks' && <TaskPanel data={data} />}
          {activeTab === 'safety' && <SafetyAlerts data={data} />}
          {activeTab === 'progress' && <ProgressTracker data={data} />}
          {activeTab === 'emergency' && <EmergencyProtocols data={data} />}
          {activeTab === 'profile' && <div className="tab-content"><h2>User Profile</h2></div>}
          {activeTab === 'contact' && <div className="tab-content"><h2>Contact Us</h2></div>}
        </main>
      </div>
    </div>
  );
}

export default Home;

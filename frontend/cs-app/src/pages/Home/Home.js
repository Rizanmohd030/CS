import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FiUser,
  FiLogIn,
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiCalendar,
  FiAlertTriangle,
  FiSettings,
  FiMail,
  FiChevronDown,
  FiMapPin,
  FiPhone,
} from 'react-icons/fi';

// Import your panels
import DisplayBoard from '../../pages/DisplayBoard/DisplayBoard';
import AttendancePanel from '../../panels/AttendancePanel/AttendancePanel';
import TaskPanel from '../../panels/TaskPanel/TaskPanel';
import SafetyAlerts from '../../panels/SafetyAlerts/SafetyAlerts';
import ProgressTracker from '../../panels/ProgressTracker/ProgressTracker';
import EmergencyProtocols from '../../panels/EmergencyProtocols/EmergencyProtocols';

import styles from '../../pages/Home/Home.module.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dbStatus, setDbStatus] = useState('checking');
  const [constructionData, setConstructionData] = useState(null);

  // Menu items data
  const menuItems = [
    { id: 'dashboard', icon: <FiHome />, label: 'Dashboard' },
    { id: 'profile', icon: <FiUser />, label: 'My Profile' },
    { id: 'contact', icon: <FiMail />, label: 'Contact Us' },
    { id: 'settings', icon: <FiSettings />, label: 'Settings' }
  ];

  // Dashboard sub-items
  const dashboardItems = [
    { id: 'attendance', label: 'Attendance' },
    { id: 'tasks', label: 'Task Management' },
    { id: 'safety', label: 'Safety Alerts' },
    { id: 'progress', label: 'Progress Tracker' },
    { id: 'emergency', label: 'Emergency Protocols' }
  ];

  // Demo data fallback
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

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/health');
        setDbStatus(response.data.connected ? 'connected' : 'disconnected');

        const dataResponse = await axios.get('http://localhost:5000/api/construction-data');
        setConstructionData(dataResponse.data);
      } catch (error) {
        setDbStatus('error');
        console.error('Data fetching error:', error);
      }
    };

    fetchData();
  }, []);

  // Toggle dashboard dropdown
  const toggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  // Close dropdown when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest(`.${styles.dashboardContainer}`)) return;
      setIsDashboardOpen(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auth handlers
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({ name: "Admin User", role: "Manager" });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Get current data (API or fallback)
  const currentData = constructionData || demoData;

  return (
    <div className={styles.appContainer}>
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.appTitle}>Construction AI</h1>
          <div className={styles.headerContainer} style={{ backgroundColor: '#e6f7ff', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
  <nav className={styles.horizontalNav}>
    <ul className={styles.horizontalNavMenu} style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '20px' }}>
      {menuItems.map(item => (
        <li 
          key={item.id} 
          className={styles.horizontalNavItem}
          style={{ position: 'relative' }}
        >
          {item.id === 'dashboard' ? (
            <>
              <button
                className={`${styles.horizontalNavButton} ${activeTab.startsWith('dashboard') ? styles.active : ''}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                onClick={toggleDashboard}
                aria-expanded={isDashboardOpen}
                aria-haspopup="true"
              >
                {item.icon}
                <span>{item.label}</span>
                <FiChevronDown className={`${styles.dropdownIcon} ${isDashboardOpen ? styles.rotate : ''}`} />
              </button>
              
              {isDashboardOpen && (
                <ul className={styles.dropdownMenu} style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '8px 0',
                  zIndex: 100,
                  minWidth: '200px'
                }}>
                  {dashboardItems.map(subItem => (
                    <li key={subItem.id} style={{ listStyle: 'none' }}>
                      <button
                        className={`${styles.dropdownItem} ${activeTab === subItem.id ? styles.activeSubItem : ''}`}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 16px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setActiveTab(subItem.id);
                          setIsDashboardOpen(false);
                        }}
                      >
                        {subItem.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <button
              className={`${styles.horizontalNavButton} ${activeTab === item.id ? styles.active : ''}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  </nav>
</div>
          <button 
            className={styles.mobileMenuButton} 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <div className={styles.authSection}>
            {!isLoggedIn ? (
              <>
                <button className={`${styles.authButton} ${styles.loginButton}`} onClick={handleLogin}>
                  <FiLogIn /> Login
                </button>
                <button className={`${styles.authButton} ${styles.signupButton}`}>
                  <FiUser /> Sign Up
                </button>
              </>
            ) : (
              <div className={styles.userProfile}>
                <span className={styles.welcomeMessage}>Welcome, {user?.name}</span>
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <nav className={styles.mobileNavMenu}>
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className={`${styles.mobileMenuItem} ${activeTab === item.id ? styles.active : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className={styles.menuIcon}>{item.icon}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          {activeTab === 'dashboard' && (
            <DisplayBoard 
              title="Construction Site Dashboard"
              attendance={{
                present: currentData.currentWorkers,
                total: currentData.totalWorkers
              }}
              tasks={currentData.tasks}
              alerts={currentData.alerts}
            />
          )}
          {activeTab === 'attendance' && <AttendancePanel data={currentData} />}
          {activeTab === 'tasks' && <TaskPanel data={currentData} />}
          {activeTab === 'safety' && <SafetyAlerts data={currentData} />}
          {activeTab === 'progress' && <ProgressTracker data={currentData} />}
          {activeTab === 'emergency' && <EmergencyProtocols data={currentData} />}
          {activeTab === 'profile' && <div className={styles.tabContent}><h2>User Profile</h2></div>}
          {activeTab === 'contact' && <div className={styles.tabContent}><h2>Contact Us</h2></div>}
        </div>
      </main>

      <footer className={styles.appFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>About Construction AI</h3>
            <p>Revolutionizing construction site management with AI-powered tools.</p>
          </div>
          
          <div className={styles.footerSection}>
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3>Contact Us</h3>
            <ul>
              <li><FiMapPin /> 123 Construction St</li>
              <li><FiPhone /> (123) 456-7890</li>
              <li><FiMail /> info@constructionai.com</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Construction AI</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
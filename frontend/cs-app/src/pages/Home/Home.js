import React, { useState } from 'react';
import {
  FiUser, FiLogIn, FiMenu, FiX, FiHome,
  FiUsers, FiCalendar, FiAlertTriangle,
  FiSettings, FiMail, FiChevronDown,
  FiMapPin, FiPhone
} from 'react-icons/fi';
import styles from './Home.module.css';

// Import your panels
// Using jsconfig.json baseUrl (recommended)
import DisplayBoard from '../DisplayBoard/DisplayBoard';
import AttendancePanel from '../../panels/AttendancePanel/AttendancePanel';
import TaskPanel from '../../panels/TaskPanel/TaskPanel';
import SafetyAlerts from '../../panels/SafetyAlerts/SafetyAlerts';
import ProgressTracker from '../../panels/ProgressTracker/ProgressTracker';
import EmergencyProtocols from '../../panels/EmergencyProtocols/EmergencyProtocols';


function Home({ dbStatus = 'connected', constructionData, user, onLogin, onLogout }) {
  // UI State Only
  const [activeTab, setActiveTab] = useState(null); // Start with no tab selected
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Menu config
  const menuItems = [
    { id: 'dashboard', icon: <FiHome />, label: 'Dashboard' },
    { id: 'profile', icon: <FiUser />, label: 'My Profile' },
    { id: 'contact', icon: <FiMail />, label: 'Contact Us' },
    { id: 'settings', icon: <FiSettings />, label: 'Settings' }
  ];

  // Dashboard sub-items
  const dashboardItems = [
    { id: 'attendance', label: 'Attendance', icon: <FiUsers /> },
    { id: 'tasks', label: 'Task Management', icon: <FiCalendar /> },
    { id: 'safety', label: 'Safety Alerts', icon: <FiAlertTriangle /> },
    { id: 'progress', label: 'Progress Tracker', icon: <FiCalendar /> },
    { id: 'emergency', label: 'Emergency Protocols', icon: <FiAlertTriangle /> }
  ];

  // Demo data fallback
  const demoData = {
    currentWorkers: 18,
    totalWorkers: 30,
    tasks: [],
    alerts: []
  };
  const currentData = constructionData || demoData;

  // Handlers
  const toggleDashboard = (e) => {
    e.stopPropagation();
    setIsDashboardOpen(!isDashboardOpen);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsDashboardOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.appTitle}  
          onClick={() => setActiveTab(null)}
      
          >Construction AI</h1>
          
          <div className={styles.headerContainer}>
            <nav className={styles.horizontalNav}>
              <ul className={styles.horizontalNavMenu}>
                {menuItems.map(item => (
                  <li key={item.id} className={styles.horizontalNavItem}>
                    {item.id === 'dashboard' ? (
                      <div className={styles.dashboardContainer}>
                        <button
                          className={`${styles.horizontalNavButton} ${activeTab?.startsWith('dashboard') ? styles.active : ''}`}
                          onClick={toggleDashboard}
                          aria-expanded={isDashboardOpen}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                          <FiChevronDown className={`${styles.dropdownIcon} ${isDashboardOpen ? styles.rotate : ''}`} />
                        </button>
                        
                        {isDashboardOpen && (
                          <ul className={styles.dropdownMenu}>
                            {dashboardItems.map(subItem => (
                              <li key={subItem.id}>
                                <button
                                  className={`${styles.dropdownItem} ${activeTab === subItem.id ? styles.activeSubItem : ''}`}
                                  onClick={() => handleTabChange(subItem.id)}
                                >
                                  {subItem.icon}
                                  <span>{subItem.label}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <button
                        className={`${styles.horizontalNavButton} ${activeTab === item.id ? styles.active : ''}`}
                        onClick={() => handleTabChange(item.id)}
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <div className={styles.authSection}>
            {!user ? (
              <>
                <button className={`${styles.authButton} ${styles.loginButton}`} onClick={onLogin}>
                  <FiLogIn /> Login
                </button>
                <button className={`${styles.authButton} ${styles.signupButton}`}>
                  <FiUser /> Sign Up
                </button>
              </>
            ) : (
              <div className={styles.userProfile}>
                <span className={styles.welcomeMessage}>Welcome, {user.name}</span>
                <button className={styles.logoutButton} onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          {!activeTab && (
            <div className={styles.emptyState}>
              <h2>Welcome to Construction AI</h2>
              <p>Select an option from the menu to begin</p>
            </div>
          )}
          
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
        {/* Footer content remains the same */}
      </footer>
    </div>
  );
}

export default Home;
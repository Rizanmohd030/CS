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
const toggleDashboard = (e) => {
  e.stopPropagation(); // Prevent the event from bubbling up
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

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsDashboardOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.appTitle}>Construction AI</h1>
          <div className={styles.headerContainer}>
            <nav className={styles.horizontalNav}>
              <ul className={styles.horizontalNavMenu}>
                {menuItems.map(item => (
                  <li key={item.id} className={styles.horizontalNavItem}>
                    {item.id === 'dashboard' ? (
                      <div className={styles.dashboardContainer}>
                       <button
  className={`${styles.horizontalNavButton} ${activeTab.startsWith('dashboard') ? styles.active : ''}`}
  onClick={(e) => {
    e.stopPropagation();
    toggleDashboard(e);
  }}
  aria-expanded={isDashboardOpen}
  aria-haspopup="true"
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
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from reaching parent
            setActiveTab(subItem.id); // Set the active tab
            setIsDashboardOpen(false); // Close the dropdown
          }}
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
                        className={`${styles.horizontalNavButton} ${
                          activeTab === item.id ? styles.active : ''
                        }`}
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
                <div key={item.id}>
                  {item.id === 'dashboard' ? (
                    <>
                      <button
                        className={`${styles.mobileMenuItem} ${
                          activeTab.startsWith('dashboard') || dashboardItems.some(d => d.id === activeTab)
                            ? styles.active
                            : ''
                        }`}
                        onClick={toggleDashboard}
                      >
                        <span className={styles.menuIcon}>{item.icon}</span>
                        <span className={styles.menuLabel}>{item.label}</span>
                        <FiChevronDown className={`${styles.dropdownIcon} ${isDashboardOpen ? styles.rotate : ''}`} />
                      </button>
                      
                      {isDashboardOpen && (
                        <div className={styles.mobileSubMenu}>
                          {dashboardItems.map(subItem => (
                            <button
                              key={subItem.id}
                              className={`${styles.mobileMenuItem} ${
                                activeTab === subItem.id ? styles.active : ''
                              }`}
                              onClick={() => handleTabChange(subItem.id)}
                              style={{ paddingLeft: '2rem' }}
                            >
                              <span className={styles.menuIcon}>{subItem.icon}</span>
                              <span className={styles.menuLabel}>{subItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      className={`${styles.mobileMenuItem} ${
                        activeTab === item.id ? styles.active : ''
                      }`}
                      onClick={() => handleTabChange(item.id)}
                    >
                      <span className={styles.menuIcon}>{item.icon}</span>
                      <span className={styles.menuLabel}>{item.label}</span>
                    </button>
                  )}
                </div>
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
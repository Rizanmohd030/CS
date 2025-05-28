// src/pages/Home/Home.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useAuth } from '../../hooks/useAuth'; // Import useAuth hook
import {
  FiUser, FiLogIn, FiMenu, FiX, FiHome,
  FiUsers, FiCalendar, FiAlertTriangle,
  FiSettings, FiMail, FiChevronDown,
  FiMapPin, FiPhone
} from 'react-icons/fi';
import styles from './Home.module.css';

// Import your panels and DisplayBoard (as you already have)
import DisplayBoard from '../DisplayBoard/DisplayBoard';
import AttendancePanel from '../../panels/AttendancePanel/AttendancePanel';
import TaskPanel from '../../panels/TaskPanel/TaskPanel';
import SafetyAlerts from '../../panels/SafetyAlerts/SafetyAlerts';
import ProgressTracker from '../../panels/ProgressTracker/ProgressTracker';
import EmergencyProtocols from '../../panels/EmergencyProtocols/EmergencyProtocols';

// HomePage will receive dbStatus and constructionData from AppRoutes (passed from App)
function Home({ dbStatus = 'connected', constructionData }) {
  // Use useAuth to get authentication status and functions
  // We'll still keep these, as they allow the login/logout buttons to work
  // and for you to eventually add more complex conditional rendering for *some* features.
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // For programmatic navigation

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

  // Handler for Logout button (still functional)
  const handleLogout = () => {
    logout(); // Call the logout function from useAuth
    // Optional: navigate to / or /login after logout
    navigate('/');
  };

  // Handler for Login button
  const handleLoginClick = () => {
    navigate('/login'); // Navigate to the login route
  };

  // Handler for Sign Up button
  const handleSignUpClick = () => {
    navigate('/signup'); // Navigate to the signup route
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
            {/* Conditional rendering for Login/Logout buttons based on authentication status */}
            {!isAuthenticated ? ( // Use isAuthenticated from useAuth
              <>
                <button className={`${styles.authButton} ${styles.loginButton}`} onClick={handleLoginClick}>
                  <FiLogIn /> Login
                </button>
                <button className={`${styles.authButton} ${styles.signupButton}`} onClick={handleSignUpClick}>
                  <FiUser /> Sign Up
                </button>
              </>
            ) : (
              <div className={styles.userProfile}>
                <span className={styles.welcomeMessage}>Welcome, {user?.name || 'User'}</span> {/* Safely access user.name */}
                <button className={styles.logoutButton} onClick={handleLogout}>
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
              {/* Optional: Add a call to action if not logged in */}
              {!isAuthenticated && <p>Or <button onClick={handleLoginClick}>Login</button> to access personalized features.</p>}
            </div>
          )}

          {/* All panels and dashboard content are now rendered publicly without authentication check */}
          {activeTab === 'dashboard' && (
            <DisplayBoard
              title="Construction Site Dashboard"
              attendance={{
                present: currentData.currentWorkers,
                total: currentData.currentWorkers // Corrected: should be totalWorkers if that's the intention
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
          {activeTab === 'profile' && <div className={styles.tabContent}><h2>User Profile</h2><p>This content is now publicly viewable.</p></div>}
          {activeTab === 'contact' && <div className={styles.tabContent}><h2>Contact Us</h2><p>Get in touch with us!</p></div>}
          {activeTab === 'settings' && <div className={styles.tabContent}><h2>Settings</h2><p>These settings are also publicly viewable for now.</p></div>}
        </div>
      </main>

      {/* Footer (as you have) */}
      <footer className={styles.appFooter}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>About Construction AI</h3>
            <p>Revolutionizing construction site management with AI-powered tools for safety, efficiency, and productivity.</p>
          </div>

          <div className={styles.footerSection}>
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3>Contact Us</h3>
            <ul>
              <li><FiMapPin /> 123 Construction St, Build City</li>
              <li><FiPhone /> (123) 456-7890</li>
              <li><FiMail /> info@constructionai.com</li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Construction AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
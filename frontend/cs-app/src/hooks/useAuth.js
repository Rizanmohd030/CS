// src/hooks/useAuth.js

import React, { useState, useEffect, createContext, useContext } from 'react'; // <--- ADD useContext here
import { login as apiLogin, logout as apiLogout, verifyToken } from '../services/auth';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';

export const AuthContext = createContext(null); // Initialize with null for clarity

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const verifiedUser = await verifyToken(token);
          setUser(verifiedUser);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('auth_token'); // Clear invalid token
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const { user: userData, token } = await apiLogin(credentials); // Renamed `user` to `userData` to avoid conflict
    localStorage.setItem('auth_token', token);
    setUser(userData);
    return userData; // Return user data upon successful login
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if API logout fails, clear local state for better UX
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  // Render the loading screen if data is being fetched
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- ADD THIS CUSTOM HOOK ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
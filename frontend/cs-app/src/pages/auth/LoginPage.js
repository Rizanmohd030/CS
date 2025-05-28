import React, { useState } from 'react'; // Import React
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../../components/auth/LoginForm';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (credentials) => {
    try {
      await login(credentials);
      navigate('/dashboard'); // Redirect to your DisplayBoard
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <h1 className={styles.title}>Construction Site Login</h1>
        <div className={styles.logo}>🏗️</div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <LoginForm onSubmit={handleSubmit} />
        
        <div className={styles.footer}>
          <Link to="/signup">Create admin account</Link>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}

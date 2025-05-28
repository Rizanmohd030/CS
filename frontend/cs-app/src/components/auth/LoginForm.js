// src/components/auth/LoginForm.js
// (Assuming you have a similar structure for SignUp.js)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
// import styles from './LoginForm.module.css'; // If you have CSS modules

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth(); // Get the login function from AuthContext
  const navigate = useNavigate(); // For redirection after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await login({ email, password });
      // If login is successful, navigate to the home page
      navigate('/'); // Or navigate('/dashboard') if you want to land there directly
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div /* className={styles.loginFormContainer} */>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div /* className={styles.error} */ style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
      {/* Optional: Link to signup page if user doesn't have an account */}
      <p>Don't have an account? <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: 'blue' }}>Sign Up</span></p>
    </div>
  );
}
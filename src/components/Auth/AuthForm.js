import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // NEW

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true); // Start loading
    const url = isLogin
      ? 'https://task-server-47fa.onrender.com/api/auth/login'
      : 'https://task-server-47fa.onrender.com/api/auth/signup';

    try {
      const res = await axios.post(url, { email, password });

      if (isLogin && res.data.token) {
        localStorage.setItem('token', res.data.token);
        onAuthSuccess(); // Inform App.js login was successful
      } else if (!isLogin) {
        alert('Signup successful! You can now login.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (isLogin ? 'Invalid credentials' : 'Signup failed')
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="auth-container">
      <div className={`auth-box ${isLogin ? 'login-mode' : 'signup-mode'}`}>
        <div className="form-wrapper">
          <form className="form" onSubmit={handleSubmit}>
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
            </button>
            <p onClick={toggleMode} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <span>{isLogin ? 'Sign Up' : 'Login'}</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;

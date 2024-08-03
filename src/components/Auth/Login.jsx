import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearMessages } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo-BJW8Xa_C.png';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { loading, error, message, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (message || error) {
      setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
    }
  
    // Ensure you navigate only when the user is logged in
    if (user) {
      navigate('/income');
    }
  }, [message, error, user, dispatch, navigate]);  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));
    
    // Check if the loginUser action was fulfilled successfully
    if (loginUser.fulfilled.match(resultAction)) {
      const authToken = resultAction.payload.auth_token;
      localStorage.setItem('auth_token', authToken);
      // Navigate to income only on successful login
      navigate('/income');
    } else {
      // Log the error and show the error message
      console.error("Login failed:", resultAction.payload);
    }
  };

  const easyNavi = (i) => {
    if(i === 'Sign-up') {
      navigate('/register');
    }

    if(i === 'Reset') {
      navigate('/reset-password');
    }
  }

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <img className='auth-header-logo' src={Logo} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className='auth-submit-btn' type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className='section-OR'>------------ OR ------------</p>
        <p className='reset-password' onClick={() => easyNavi('Reset')}>Forgot password?</p>
        <p className='Sign-up_quest'>Don't have an account? <span className='Sign-up_span' onClick={() => easyNavi('Sign-up')}>Sign up</span></p>
      </div>
    </div>
  );
};

export default Login;

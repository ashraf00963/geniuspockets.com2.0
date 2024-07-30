import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearMessages } from '../../redux/slices/authSlice';
import Lock from '../../assets/lock.png';
import './Auth.css';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (message || error) {
            setTimeout(() => {
                dispatch(clearMessages());
            }, 3000);
        }
    }, [message, error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword({ email }));
    };

    return (
        <div className='auth-page'>
            <div className='auth-container'>
                <img className='lock-logo' src={Lock} />
                <h2>Reset Password</h2>
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
                    <button className='auth-submit-btn' type="submit" disabled={loading}>
                        {loading ? 'Sending reset link...' : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;

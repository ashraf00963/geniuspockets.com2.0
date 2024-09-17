import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearMessages } from '../../redux/slices/authSlice';
import Lock from '../../assets/lock.webp';
import { ToastContainer } from 'react-toastify';
import { notifySuccess, notifyError } from '../../utils/notificationService'; // Import notification service
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { loading, error, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (error) {
            notifyError(error);  // Use centralized error notification
        }

        if (message) {
            notifySuccess(message);  // Use centralized success notification
        }

        // Clear messages after displaying
        if (message || error) {
            dispatch(clearMessages());
        }
    }, [message, error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword({ email }));
    };

    return (
        <div className='auth-page'>
            <div className='auth-container'>
                <img className='lock-logo' src={Lock} alt="Lock" />
                <h2>Reset Password</h2>
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
            <ToastContainer />  {/* Toast container to display notifications */}
        </div>
    );
};

export default ResetPassword;

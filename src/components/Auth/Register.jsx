import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearMessages } from '../../redux/slices/authSlice';
import Logo from '../../assets/gpLogo.webp';
import { ToastContainer } from 'react-toastify';
import { notifySuccess, notifyError } from '../../utils/notificationService'; // Import notification service
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        dispatch(registerUser({ first_name: firstName, last_name: lastName, email, password }));
    };

    return (
        <div className='auth-page'>
            <div className="auth-container">
                <img className='auth-header-logo' src={Logo} alt="Logo" />
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
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
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
            <ToastContainer />  {/* Toast container to display notifications */}
        </div>
    );
}

export default Register;

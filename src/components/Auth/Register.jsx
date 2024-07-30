import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearMessages } from '../../redux/slices/authSlice';
import Logo from '../../assets/logo-BJW8Xa_C.png';
import './Auth.css';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const { loading, error, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if(message || error) {
            setTimeout(() => {
                dispatch(clearMessages());
            }, 3000);
        }
    }, [message, error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ first_name: firstName, last_name: lastName, email, password}));
    };

    return (
        <div className='auth-page'>
            <div className="auth-container">
                <img className='auth-header-logo' src={Logo} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'red' }}>{message}</p>}
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
        </div>
    )
}

export default Register;
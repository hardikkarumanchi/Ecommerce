import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks'; // Our custom hooks
import { loginUser } from '../features/auth/authSlice';     // Our Messenger

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Grab the loading and error status from the "Brain"
    const { isLoading, error } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Dispatch the login action
        const resultAction = await dispatch(loginUser({ email, password }));

        // 2. Check if it was successful
        if (loginUser.fulfilled.match(resultAction)) {
            navigate('/home'); // Redirect to Home
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>

                {/* Show an error message if the login fails */}
                {error && <p style={{ color: 'red' }}>{error}</p>}

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

                {/* Change button text if it's currently loading */}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Checking...' : 'Login'}
                </button>
                <p style={{ marginTop: '1rem' }}>
                    Don't have an account? 
                <Link to="/signup">Sign up</Link>
                </p>

            </form>
        </div>
    );
};

export default Login;

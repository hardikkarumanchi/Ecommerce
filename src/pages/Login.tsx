import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginUser } from '../features/auth/authSlice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { isLoading, error } = useAppSelector((state) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Dispatch the login action and wait for the result
        const resultAction = await dispatch(loginUser({ email, password }));

        // 2. Check if the login was successful
        if (loginUser.fulfilled.match(resultAction)) {
            const userProfile = resultAction.payload; // This contains the user data from Profile table

            if (userProfile.role === 'admin') {
                console.log("Admin detected, routing to Dashboard...");
                navigate('/admin');
            } else {
                console.log("Standard user detected, routing to Home...");
                navigate('/home');
            }
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>

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

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Checking...' : 'Login'}
                </button>
                
                <p style={{ marginTop: '1rem' }}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;

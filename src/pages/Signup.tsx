import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { registerUser } from '../features/auth/authSlice';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dispatch the registration messenger
    const resultAction = await dispatch(registerUser({ email, password, fullName }));

    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/'); // Take them home after successful signup
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input 
          type="text" 
          placeholder="Full Name" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
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

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
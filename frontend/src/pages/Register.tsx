import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('BORROWER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register({ 
        email, 
        phone, 
        password, 
        roles: [role] 
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Create Account</h1>
          <p className="card-description">Join our invoice financing platform</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="label">Phone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input"
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="label">I am a</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select"
              required
            >
              <option value="BORROWER">Borrower (Need Financing)</option>
              <option value="LENDER">Lender (Provide Financing)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              required
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb' }}>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;







import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegistrationForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Registered Successfully!");
          navigate('/login');
        } else {
          toast.error('Email already registered');
        }
      })
      .catch((error) => {
        console.error('Registration request failed:', error);
      });
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card w-50">
        <div className="card-body mx-2">
          <h3 className="card-title text-center">Registration</h3>
          <form onSubmit={handleRegister}>
            <div className="mt-4">
              <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            </div>
            <div className="my-3">
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" minLength={8} required />
              <small className="form-text text-muted">Password must contain at least 8 characters.</small>
            </div>
            <div className="my-3">
              <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" minLength={8} required />
              <small className="form-text text-muted">Please confirm your password.</small>
            </div>
            <div className="my-3">
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required />
              <small className="form-text text-muted">Please enter a valid email address.</small>
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
            <a href='/login' className='mx-2'>Sign In</a>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default RegistrationForm;

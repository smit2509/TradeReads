import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
  
    const loginData = {
      email: email,
      password: password,
    };
  
    // https://legacy.reactjs.org/docs/faq-ajax.html
    // Reference: AJAX and APIs
    fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (response.ok) {
          toast.success('Logged In Successfully!');
        
          return response.json();
        } else {
          toast.error('Invalid credentials');
        }
      })
      .then((data) => {
        localStorage.setItem('user_id', data.user.user_id);
        localStorage.setItem('email', data.user.email);
        navigate('/books');
      })
      .catch((error) => {
        console.error('Login request failed:', error);
      });
  };
  
  
  // https://getbootstrap.com/docs/5.3/examples/
  // Reference: Bootstrap examples
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
  <div div className="card w-50">
    <div className="card-body mx-2">

      <h3 className="card-title text-center">Login</h3>
      <form onSubmit={handleLogin}>
        <div className="mt-4">
          <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </div>
        <div className="my-3">
          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
  <ToastContainer />
</div>

  );
}

export default LoginForm;

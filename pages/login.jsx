// src/pages/Login.jsx
import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/login', { userName, password });
      localStorage.setItem('token', res.data.token);
      alert('Login Success');
      navigate('/dashboard');
    } catch (err) {
      alert('Login Failed');
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input className="form-control mb-2" placeholder="Username" onChange={e => setUserName(e.target.value)} />
        <input className="form-control mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-success w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;

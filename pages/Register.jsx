// src/pages/Register.jsx
import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/register', { userName, password });
      alert('Registered Successfully');
      navigate('/login');
    } catch (err) {
      alert('Registration Failed');
    }
  };

  return (
    <div className="container mt-5 col-md-4">
      <h3>Register</h3>
      <form onSubmit={handleRegister}>
        <input className="form-control mb-2" placeholder="Username" onChange={e => setUserName(e.target.value)} />
        <input className="form-control mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}

export default Register;

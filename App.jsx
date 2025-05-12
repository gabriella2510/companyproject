// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;

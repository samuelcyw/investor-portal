import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AdminUserManagerPage from './pages/AdminUserManagerPage'; // <-- NEW

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/admin-users" element={<AdminUserManagerPage />} /> {/* <-- NEW */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

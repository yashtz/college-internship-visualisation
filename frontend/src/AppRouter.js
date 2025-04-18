import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import './AppRouter.css';


function AppRouter() {
  return (
    <Router>
      <div className="app-container">
        <nav className="main-nav">
          <div className="nav-logo">📊 Internship Platform</div>
          <ul className="nav-links">
            <li>
              <Link to="/">Dashboard</Link>
            </li>
          </ul>
        </nav>

        <div className="content-container">
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AppRouter;
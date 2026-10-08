import React from 'react';
import { Link } from 'react-router-dom';
import { getUser, logout } from '../utils/auth.js';
import { navigation } from '../utils/navigation.js';

export function Navbar() {
  const user = getUser();
  const accessRoutes = navigation[user.role] || [];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">EVIDENT.AI</Link>
      </div>

      <div className="navbar-links">
        {accessRoutes.map((eachRoute)=>(<Link key={eachRoute.path} to={eachRoute.path}>{eachRoute.label}</Link>))
        }
      </div>

      <div className="navbar-user">
        <div className="user-details">
          <span className="user-name">{user.full_name}</span>
          <span className="user-role">{user.role}</span>
        </div>
        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

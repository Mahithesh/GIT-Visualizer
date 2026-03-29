import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import './index.css'

const Header = () => (
  <header className="header">
    <div className="header-content">
      <Link to="/" className="brand-link">
        GitHub Profile Visualizer
      </Link>
      <nav>
        <ul className="nav-list">
          <li>
            <NavLink exact to="/" className="nav-link" activeClassName="active-link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/repositories" className="nav-link" activeClassName="active-link">
              Repositories
            </NavLink>
          </li>
          <li>
            <NavLink to="/analysis" className="nav-link" activeClassName="active-link">
              Analysis
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
)

export default Header
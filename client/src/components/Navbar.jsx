import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <div className="navbar-brand-icon">🧠</div>
        StressIQ
      </NavLink>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          Home
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          + Add Student
        </NavLink>
        <NavLink to="/analysis" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          Analysis
        </NavLink>
      </div>
    </nav>
  );
}

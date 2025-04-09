import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../pages/userContext';
import './Navbar.css';


export default function Navbar() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      {!isLoggedIn && (
      <Link to="/login" className="nav-link">Login</Link>
      )}


      {isLoggedIn && (
        <Link to="/startscreen" className="nav-link">Inventory</Link>
      )}
    </nav>
  );
}



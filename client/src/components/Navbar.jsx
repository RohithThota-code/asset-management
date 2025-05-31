import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { toast } from "react-hot-toast";
import { UserContext } from '../pages/userContext'; // Adjust path if needed

const Navbar = () => {
  const { isLoggedIn, logout, user } = useContext(UserContext);
  
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <nav >
      <div >
        
        <div >
          <Link to="/" >Home</Link>
          <div>
          {isLoggedIn ? (
              <button className="link‐style-button" onClick={logout}>
            Logout
            </button>

         ) : (
           <Link to="/login">
             
              Login
          
          </Link>
         )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

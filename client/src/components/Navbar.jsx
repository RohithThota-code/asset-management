import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { UserContext } from '../pages/userContext';
import { toast } from "react-hot-toast";

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

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        toast.success('Logged out!');
        navigate('/');
      } else {
        const errorData = await response.json();
        toast.error(`Logout failed: ${errorData.error}`);
      }
    } catch {
      toast.error('Error during logout.');
    }
  };

  return (
    <nav >
      <div >
        
        <div >
          <Link to="/" >Home</Link>
          <Link to="/login" >Login</Link>

          {/* Avatar dropdown */}
          {isLoggedIn && (
            <div ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} >
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </button>
              {dropdownOpen && (
                <div >
                  <div >{user?.username || 'User'}</div>
                  <br />
                  <button 
                    onClick={handleLogout}
                    
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

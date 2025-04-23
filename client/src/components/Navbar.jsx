import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../pages/userContext';
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Logged out successfully!');
        navigate('/');
      } else {
        const errorData = await response.json();
        toast.error(`Logout failed: ${errorData.error}`);
      }
    } catch (error) {
      toast.error('An error occurred during logout.');
    }
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-md text-white">
      <div className="container mx-auto flex items-center justify-start space-x-4">
        <Link to="/" className="px-4 py-2 rounded border border-blue-400 hover:bg-blue-700">
          Home
        </Link>
        <Link to="/login" className="px-4 py-2 rounded border border-blue-400 hover:bg-blue-700">
          Login
        </Link>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded border border-red-400 hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;



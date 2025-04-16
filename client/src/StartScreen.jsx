import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserContext } from './pages/userContext'; // adjust path if needed

const StartScreen = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Get user from context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    console.log("Token:", token); // Debugging line
    setIsLoggedIn(!!token);
  }, []);

  const sendToCI = () => {
    navigate("/warehouse");
  };

  return (
    <div className="start-screen">
      <h1>Welcome{user?.username ? `, ${user.username}` : ""}</h1>
      <br />
      <button onClick={sendToCI}>CURRENT INVENTORY</button>
    </div>
  );
};

export default StartScreen;



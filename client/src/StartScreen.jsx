import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './pages/userContext';

const StartScreen = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8000/profile', { withCredentials: true });
        // 🔐 token is auto-sent
        setUser(res.data); // ✅ set user in context
        setIsLoggedIn(true);
        console.log("Authenticated user:", res.data);
      } catch (err) {
        setIsLoggedIn(false);
        console.error("Not logged in:", err);
      }
    };

    fetchProfile();
  }, [setUser]);

  const sendToCI = () => navigate("/warehouse");

  return (
    <div className="start-screen">
      <h1>Welcome{user?.username ? `, ${user.username}` : ""}</h1>
      <br />
      <button onClick={sendToCI}>CURRENT INVENTORY</button>
    </div>
  );
};

export default StartScreen;



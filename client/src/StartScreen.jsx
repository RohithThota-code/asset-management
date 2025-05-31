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
        
        setUser(res.data); 
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
  <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-10">
      Welcome{user?.username ? `, ${user.username}` : ""}
    </h1>

    <button
      onClick={sendToCI}
      className="
        inline-flex items-center 
        px-8 py-4 
        bg-black text-white 
        rounded-full 
        text-lg font-medium 
        shadow-lg 
        hover:shadow-xl hover:bg-zinc-900 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black 
        transition
      "
    >
      CURRENT INVENTORY
    
    </button>

  </div>
);

};

export default StartScreen;



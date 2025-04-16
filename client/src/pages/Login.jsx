import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../pages/userContext"; // correct path





export default function Login() {
    const { setUser, setIsLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();
    const [data, setData] = useState({ 
        email: '',
        password: '',
    });

    const loginUser = async (e) => {
        e.preventDefault();
        console.log(data);

        const { email, password } = data; 

        try {
            const response = await axios.post('/login', { email, password }, { withCredentials: true });

            const responseData = response.data;

            if (responseData.error) {
                toast.error(responseData.error);
            } else {
                setData({ email: '', password: '' });
                setUser(responseData.user);      // <-- This sets the context immediately
                setIsLoggedIn(true);             // <-- Avoids redirect loop
                toast.success("Login successful!");
                navigate('/startscreen');
                
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while logging in.');
        }
    };

    return (
        <div>
            <h3>Login</h3>
            <br />
            <form onSubmit={loginUser}>
                <label>Email</label>
                <input
                    type="text"
                    placeholder="Enter email"
                    value={data.email} 
                    onChange={(e) => setData({ ...data, email: e.target.value })} 
                />
                <br/>
                <br/>
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    value={data.password} 
                    onChange={(e) => setData({ ...data, password: e.target.value })} 
                />
                <button type="submit">Submit</button>
                
            </form>
        </div>
    );
};


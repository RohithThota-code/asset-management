
import {  Routes, Route } from 'react-router-dom';
import './index.css'
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StartScreen from './StartScreen.jsx';
import { UserContextProvider } from './pages/userContext.jsx';
import Warehouse from './pages/Warehouse.jsx';
import WarehouseAssets from './pages/WarehouseAssets.jsx';
import History from './pages/History.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import Forecast from "./pages/Forecast";
import Admin from './pages/Admin';



axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  return (
    <UserContextProvider>
     
        <Header />
        <Navbar />
        <Toaster position="center" toastOptions={{ duration: 3000 }} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard"element={<Dashboard />}/>

          {/* Protected Routes */}
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/startscreen"
            element={
              <ProtectedRoute>
                <StartScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse"
            element={
              <ProtectedRoute>
                <Warehouse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/warehouse/:id"
            element={
              <ProtectedRoute>
                <WarehouseAssets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forecast/:assetId"
            element={
              <ProtectedRoute>
                <Forecast />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history/:warehouseId"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
          path="/admin"
            element={
              <ProtectedRoute>
              <Admin /> {/* Create this component for admin-only view */}
                </ProtectedRoute>
              }
                />

        </Routes>
      
    </UserContextProvider>
  );
}

export default App;



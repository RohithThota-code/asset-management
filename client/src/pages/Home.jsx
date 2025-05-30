import React, { useContext, useEffect } from 'react';
import { UserContext } from '../pages/userContext'; // Adjust path if needed
import { Link } from 'react-router-dom'; // Ensure Link is imported for routing
import Layout from '../components/Layout'; // Ensure Layout component is properly imported

const Home = () => {
  const { isLoggedIn, logout } = useContext(UserContext);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when component mounts
  }, []);

  return (
    <Layout hideNavbar={true}>
  <div className="landing-page-container hidden-scrollbar">
    {/* Hero Section */}
    <div className="hero-section">
  <div className="hero-content">
    <h1 className="hero-title">Welcome to AAMS</h1>
    <p className="hero-subtitle">
      Streamline, Secure & Scale Your Asset Management.
    </p>
    <Link to="/login">
      <button className="hero-button btn-outline">Login</button>
    </Link>
      </div>
      </div>

    <div>
      <br />
      {isLoggedIn ? (
        <button className="hero-button btn-outline" onClick={logout}>Logout</button>
      ) : (
        <p></p>
      )}
    </div>

    {/* Features Section */}
    <div className="features-section">
      <h2>Features</h2>
      <div className="feature-cards">
        <div className="feature-card">
          <h3>Track & Update Warehouse Assets</h3>
          <p>
            Monitor every asset across warehouses with real-time updates and complete visibility. Admins can view change history and grant permissions to team members.
          </p>
        </div>
        <div className="feature-card">
          <h3>Demand Forecasting with ML</h3>
          <p>
            Leverage powerful demand forecasting using Facebook Prophet to anticipate inventory needs and optimize procurement strategies.
          </p>
        </div>
        <div className="feature-card">
          <h3>Role-Based Access Control</h3>
          <p>
            Secure your system with clear admin/employee roles. Only authorized users can make updates, register new users, or view sensitive logs.
          </p>
        </div>
      </div>
    </div>

    {/* Contact Us Section */}
    <div className="contact-section">
      <h2>Contact Us</h2>
      <p>
        Have questions or need support? We’re here to help. Reach out anytime — our team is committed to ensuring a seamless experience.
      </p>
      <p>Email: <a href="mailto:contact@aams.com">contact@aams.com</a></p>
      <p>Mobile 1: <a href="tel:+1234567890">+1234567890</a></p>
      <p>Mobile 2: <a href="tel:+0987654321">+0987654321</a></p>
    </div>
  </div>
</Layout>

  );
};

export default Home;


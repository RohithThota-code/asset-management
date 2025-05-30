import NavbarComponent from './Navbar';

const Layout = ({ children, hideNavbar }) => {
  return (
    <div className="min-h-screen bg-muted text-gray-800 font-sans">
      {!hideNavbar && <NavbarComponent />}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

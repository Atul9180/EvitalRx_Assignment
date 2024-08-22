import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore"; // Adjust the path as needed

const Navbar = () => {
  const location = useLocation();
  const { logout } = useAuthStore();

  // Determine if the current route is one of the excluded routes
  const isAuthRoute = [
    "/login",
    "/signup",
    "/reset-password",
    "/forgot-password",
  ].includes(location.pathname);

  if (isAuthRoute) return null;

  const handleLogout = () => {
    logout();
    // Optionally, redirect to the login page after logout
    // navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 p-2 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" className="text-gray-900">
            AuthForm
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-400 text-white py-1 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

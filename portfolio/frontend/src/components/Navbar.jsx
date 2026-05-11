import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Re-run useEffect on route change just to close menus etc. (future use)
  useEffect(() => {}, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/"); // back to homepage after logout
  };

  // Safe display fallback
  const displayName = user?.name ? user.name.split(" ")[0] : "User";

  const isAdmin = user?.role === "admin";

  return (
    <nav className="bg-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 
                flex flex-wrap justify-between items-center shadow-md">
      {/* === Brand === */}
      <Link
        to="/"
        className="text-2xl font-extrabold tracking-wide hover:text-yellow-300 transition"
      >
        MyPortfolio
      </Link>

      {/* === Navigation Links === */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 
                text-sm sm:text-base space-y-2 sm:space-y-0 w-full sm:w-auto">
        <Link
          to="/"
          className="hover:text-yellow-200 transition duration-150 font-medium"
        >
          Home
        </Link>

        <Link
          to="/blogs"
          className="hover:text-yellow-200 transition duration-150 font-medium"
        >
          Blog
        </Link>

        {user ? (
          <>
            {/* ───────── Logged‑in View ───────── */}
            <span className="text-yellow-200 font-semibold">
              👋 Hi, {displayName}
              {isAdmin && (
                <span className="ml-1 bg-red-500 text-xs px-2 py-0.5 rounded">
                  ADMIN
                </span>
              )}
            </span>

            <Link
              to="/dashboard"
              className="hover:text-yellow-200 font-medium transition duration-150"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1.5 rounded-md font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* ───────── Logged‑out View: Two separate buttons ───────── */}
            <Link
              to="/user-login"
              className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-700 transition"
            >
              User Login
            </Link>
            <Link
              to="/admin"
              className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 
                         text-white px-4 py-2 rounded-md shadow-md hover:scale-105 transition-transform"
            >
              Admin Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
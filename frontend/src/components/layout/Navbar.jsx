// frontend/src/components/layout/Navbar.jsx

import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, isAuthenticated, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  async function handleLogout() {
    try {
      await signOut();

      navigate({
        to: "/login",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Application Name */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          SQL Coach
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
            {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            <span className="material-icons text-gray-700 dark:text-gray-200">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>
          
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title={user?.email || "Profile"}
              >
                <span className="material-icons text-gray-700 dark:text-gray-200">
                  person
                </span>
              </button>
            </div>
          )}

          
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
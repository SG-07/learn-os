// frontend/src/pages/Profile.jsx

import { Link } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const name = user?.user_metadata?.name || "Not available";
  const email = user?.email || "Not available";

  return (
    <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Name */}
          <div className="border-b border-gray-200 pb-5 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Name
            </p>

            <p className="mt-1 text-base text-gray-900 dark:text-white">
              {name}
            </p>
          </div>

          {/* Email */}
          <div className="border-b border-gray-200 py-5 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </p>

            <p className="mt-1 text-base text-gray-900 dark:text-white">
              {email}
            </p>
          </div>


          {/* Change Password */}
          <div className="pt-5">
            <Link
              to="/password"
              className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Change password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

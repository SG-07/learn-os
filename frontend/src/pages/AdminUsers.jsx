import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsers, getUserDetails } from "../api/auth";

function AdminUsers() {
  const { user } = useAuth();
  const userRole = (user?.app_metadata?.role || "").toLowerCase();
  const isAdmin = userRole === "admin";

  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const LIMIT = 15;

  useEffect(() => {
    if (!isAdmin) return;
    fetchUsers(1);
  }, [isAdmin]);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getUsers(page, LIMIT, searchEmail);
      setUsers(response.users || []);
      setTotalPages(Math.ceil((response.total || 0) / LIMIT));
      setCurrentPage(page);
      setSelectedUser(null);
      setSelectedUserDetails(null);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchEmail(value);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleUserClick = async (userId) => {
    try {
      setDetailsLoading(true);
      const response = await getUserDetails(userId);
      setSelectedUser(userId);
      setSelectedUserDetails(response);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchUsers(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchUsers(currentPage - 1);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-full bg-gray-100 p-4 dark:bg-gray-950 sm:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-800 dark:text-red-400">
              Access Denied: You do not have admin privileges to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-100 p-4 dark:bg-gray-950 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage Users
        </h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left Section: Search & List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Search Users
              </h2>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={handleSearch}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Users List */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Users List
                </h2>

                {loading ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Loading users...
                  </p>
                ) : users.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No users found.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleUserClick(u.id)}
                        className={`w-full text-left rounded-lg p-3 transition-colors ${
                          selectedUser === u.id
                            ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                        }`}
                      >
                        <p className="font-medium text-gray-900 dark:text-white">
                          {u.email}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {u.user_metadata?.name || "No name"}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center dark:border-gray-800 dark:bg-gray-800">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Section: User Details */}
          <div className="flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Details
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Account information for the selected user.
              </p>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              {detailsLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Loading details...
                </p>
              ) : selectedUserDetails ? (
                <dl className="space-y-4">
                  <DetailItem label="Email" value={selectedUserDetails.email} />
                  <DetailItem
                    label="Name"
                    value={selectedUserDetails.user_metadata?.name || "Not provided"}
                  />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Role
                    </dt>
                    <dd className="mt-1">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        {selectedUserDetails.app_metadata?.role || "User"}
                      </span>
                    </dd>
                  </div>
                  <DetailItem label="User id" value={selectedUserDetails.id} />
                  <DetailItem
                    label="Created"
                    value={formatTimestamp(selectedUserDetails.created_at)}
                  />
                  <DetailItem
                    label="Last sign in"
                    value={
                      selectedUserDetails.last_sign_in_at
                        ? formatTimestamp(selectedUserDetails.last_sign_in_at)
                        : "Never"
                    }
                  />
                </dl>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a user to view details.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="mt-1 break-all text-sm text-gray-900 dark:text-white">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

function formatTimestamp(value) {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleString();
}

export default AdminUsers;

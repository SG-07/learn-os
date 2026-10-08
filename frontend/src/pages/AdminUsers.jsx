import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsers, getUserDetails } from "../api/auth";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  Calendar,
  Clock,
  Mail,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  User,
  Loader2,
} from "lucide-react";

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
      <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-rose-200 bg-rose-50/70 p-8 text-center shadow-lg dark:border-rose-900/50 dark:bg-rose-950/20 backdrop-blur-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 mb-4">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-rose-900 dark:text-rose-200">
            Access Restricted
          </h2>
          <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">
            You do not have administrative privileges to view or manage platform users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60 mb-2">
            <Shield className="w-3.5 h-3.5" />
            Administration
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            User Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, inspect, and manage student and instructor accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Total Accounts: {users.length > 0 ? (totalPages > 1 ? `${users.length}+` : users.length) : 0}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Section: Search & List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Search Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-sm">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="Search students by email address..."
                  value={searchEmail}
                  onChange={handleSearch}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder-slate-500 dark:focus:bg-slate-900"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.98]"
              >
                Search
              </button>
            </form>
          </div>

          {/* Users List */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90 overflow-hidden">
            <div className="border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Registered Learners
              </h2>
              {loading && <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
            </div>

            <div className="p-4">
              {loading ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-sm">Fetching student profiles...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Users className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    No users matching criteria.
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Try refining your search query.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {users.map((u) => {
                    const isSelected = selectedUser === u.id;
                    const name = u.user_metadata?.name || u.email?.split("@")[0] || "Student";
                    const initial = name.charAt(0).toUpperCase();
                    const role = (u.app_metadata?.role || "student").toLowerCase();

                    return (
                      <button
                        key={u.id}
                        onClick={() => handleUserClick(u.id)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all border ${
                          isSelected
                            ? "bg-indigo-50/80 border-indigo-300 shadow-sm dark:bg-indigo-950/40 dark:border-indigo-700/80"
                            : "bg-white dark:bg-slate-900 border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 dark:border-slate-800/60 dark:hover:border-slate-700 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${
                              role === "admin"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                                : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                            }`}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                              {u.user_metadata?.name || name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {u.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                              role === "admin"
                                ? "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50"
                            }`}
                          >
                            {role === "admin" ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                            {role}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-3.5 flex justify-between items-center dark:border-slate-800 dark:bg-slate-900/60">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Page <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> of{" "}
                  <strong>{totalPages}</strong>
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: User Details (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-sm">
            <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800/80">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                Student Profile Dossier
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Detailed account identity & timestamps.
              </p>
            </div>

            <div className="p-6">
              {detailsLoading ? (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-sm">Loading user dossier...</p>
                </div>
              ) : selectedUserDetails ? (
                <div className="space-y-5">
                  {/* Top Header Card */}
                  <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 font-bold text-white shadow-md shadow-indigo-500/20 text-lg">
                      {(selectedUserDetails.user_metadata?.name || selectedUserDetails.email?.charAt(0) || "U").toUpperCase().slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {selectedUserDetails.user_metadata?.name || "Student"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 shrink-0" />
                        {selectedUserDetails.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <DetailItem
                      icon={Shield}
                      label="Assigned Role"
                      value={
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800">
                          {selectedUserDetails.app_metadata?.role || "Student"}
                        </span>
                      }
                    />

                    <DetailItem
                      icon={Fingerprint}
                      label="Student User ID"
                      value={
                        <code className="font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md break-all block">
                          {selectedUserDetails.id}
                        </code>
                      }
                    />

                    <DetailItem
                      icon={Calendar}
                      label="Account Created"
                      value={formatTimestamp(selectedUserDetails.created_at)}
                    />

                    <DetailItem
                      icon={Clock}
                      label="Last Active Session"
                      value={
                        selectedUserDetails.last_sign_in_at
                          ? formatTimestamp(selectedUserDetails.last_sign_in_at)
                          : "Never signed in"
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400">
                  <User className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    No student selected
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
                    Click any student from the left panel to inspect their profile metadata.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3.5 dark:border-slate-800/60 dark:bg-slate-800/30">
      <dt className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-indigo-500" />}
        {label}
      </dt>
      <dd className="text-sm text-slate-800 dark:text-slate-200">
        {value || "Not provided"}
      </dd>
    </div>
  );
}

function formatTimestamp(value) {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default AdminUsers;


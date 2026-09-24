// frontend/src/pages/auth/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";

import { supabase } from "../../lib/supabaseClient";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Login successful");

      navigate({
        to: "/dashboard",
      });
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Google login failed");

      setLoading(false);
    }
  }

  async function handleGithubLogin() {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);

      toast.error(error.message || "Github login failed");

      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center bg-gray-100 px-4 pt-12 dark:bg-gray-950">
      <div className="w-full max-w-sm rounded-xl bg-white p-7 shadow dark:bg-gray-900">
        <h1 className="mb-2 text-[22px] font-bold text-gray-900 dark:text-white">
          Login
        </h1>

        <p className="mb-9 text-sm text-gray-600 dark:text-gray-400">
          Login to SQL Coach.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1 block text-left text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border px-3 py-[7px] text-sm text-left dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-left text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border px-3 py-[7px] text-sm text-left dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-[7px] text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />

          <span className="text-xs text-gray-500 dark:text-gray-400">OR</span>

          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full rounded-lg border px-4 py-[7px] text-sm disabled:opacity-50 dark:border-gray-700 dark:text-white"
          >
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGithubLogin}
            disabled={loading}
            className="w-full rounded-lg border px-4 py-[7px] text-sm disabled:opacity-50 dark:border-gray-700 dark:text-white"
          >
            Continue with Github
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 dark:text-blue-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

// frontend/src/pages/auth/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { supabase } from "../../lib/supabaseClient";
function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  async function handleSignup(event) {
    event.preventDefault();
    setErrors({});
    setSubmitError("");
    const newErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      newErrors.name = "Full name is required.";
    }
    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: { name: trimmedName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setSubmitError(error.message);
        return;
      }
      toast.success("Account created successfully!");
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Signup failed:", error);
      setSubmitError(
        error.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  async function handleGoogleSignup() {
    try {
      setLoading(true);
      setSubmitError("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Google signup failed:", error);
      setSubmitError(error.message || "Google signup failed.");
      setLoading(false);
    }
  }
  async function handleGithubSignup() {
    try {
      setLoading(true);
      setSubmitError("");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    } catch (error) {
      console.error("GitHub signup failed:", error);
      setSubmitError(error.message || "GitHub signup failed.");
      setLoading(false);
    }
  }
  function clearFieldError(field) {
    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }
      const updatedErrors = { ...currentErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });
    setSubmitError("");
  }
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center bg-gray-100 px-4 pt-8 dark:bg-gray-950">
      {" "}
      <div className="w-full max-w-md rounded-xl bg-white p-7 shadow dark:bg-gray-900">
        {" "}
        <h1 className="mb-2 text-[22px] font-bold text-gray-900 dark:text-white">
          {" "}
          Create account{" "}
        </h1>{" "}
        <p className="mb-8 text-sm text-gray-600 dark:text-gray-400">
          {" "}
          Start learning SQL with SQL Coach.{" "}
        </p>{" "}
        {submitError && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
          >
            {" "}
            {submitError}{" "}
          </div>
        )}{" "}
        <form onSubmit={handleSignup} noValidate className="space-y-5">
          {" "}
          {/* Name */}{" "}
          <div>
            {" "}
            <label
              htmlFor="signup-name"
              className="mb-1 block text-left text-sm font-medium text-gray-900 dark:text-white"
            >
              {" "}
              Full name{" "}
            </label>{" "}
            <p
              id="signup-name-description"
              className="mb-1 text-left text-xs text-gray-500 dark:text-gray-400"
            >
              {" "}
              Enter your first and last name.{" "}
            </p>{" "}
            <input
              id="signup-name"
              name="name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearFieldError("name");
              }}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name
                  ? "signup-name-description signup-name-error"
                  : "signup-name-description"
              }
              className={`w-full rounded-lg border px-3 py-[7px] text-sm dark:bg-gray-800 dark:text-white ${errors.name ? "border-red-500 dark:border-red-500" : "dark:border-gray-700"}`}
              placeholder="Your name"
              autoComplete="name"
            />{" "}
            {errors.name && (
              <p
                id="signup-name-error"
                role="alert"
                className="mt-1 text-left text-xs text-red-600 dark:text-red-400"
              >
                {" "}
                {errors.name}{" "}
              </p>
            )}{" "}
          </div>{" "}
          {/* Email */}{" "}
          <div>
            {" "}
            <label
              htmlFor="signup-email"
              className="mb-1 block text-left text-sm font-medium text-gray-900 dark:text-white"
            >
              {" "}
              Email{" "}
            </label>{" "}
            <p
              id="signup-email-description"
              className="mb-1 text-left text-xs text-gray-500 dark:text-gray-400"
            >
              {" "}
              We'll use this email to sign in to your account.{" "}
            </p>{" "}
            <input
              id="signup-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFieldError("email");
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email
                  ? "signup-email-description signup-email-error"
                  : "signup-email-description"
              }
              className={`w-full rounded-lg border px-3 py-[7px] text-sm dark:bg-gray-800 dark:text-white ${errors.email ? "border-red-500 dark:border-red-500" : "dark:border-gray-700"}`}
              placeholder="you@example.com"
              autoComplete="email"
            />{" "}
            {errors.email && (
              <p
                id="signup-email-error"
                role="alert"
                className="mt-1 text-left text-xs text-red-600 dark:text-red-400"
              >
                {" "}
                {errors.email}{" "}
              </p>
            )}{" "}
          </div>{" "}
          {/* Password */}{" "}
          <div>
            {" "}
            <label
              htmlFor="signup-password"
              className="mb-1 block text-left text-sm font-medium text-gray-900 dark:text-white"
            >
              {" "}
              Password{" "}
            </label>{" "}
            <p
              id="signup-password-description"
              className="mb-1 text-left text-xs text-gray-500 dark:text-gray-400"
            >
              {" "}
              Password must be at least 6 characters.{" "}
            </p>{" "}
            <input
              id="signup-password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearFieldError("password");
              }}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password
                  ? "signup-password-description signup-password-error"
                  : "signup-password-description"
              }
              className={`w-full rounded-lg border px-3 py-[7px] text-sm dark:bg-gray-800 dark:text-white ${errors.password ? "border-red-500 dark:border-red-500" : "dark:border-gray-700"}`}
              placeholder="••••••••"
              autoComplete="new-password"
            />{" "}
            {errors.password && (
              <p
                id="signup-password-error"
                role="alert"
                className="mt-1 text-left text-xs text-red-600 dark:text-red-400"
              >
                {" "}
                {errors.password}{" "}
              </p>
            )}{" "}
          </div>{" "}
          {/* Confirm Password */}{" "}
          <div>
            {" "}
            <label
              htmlFor="signup-confirm-password"
              className="mb-1 block text-left text-sm font-medium text-gray-900 dark:text-white"
            >
              {" "}
              Confirm password{" "}
            </label>{" "}
            <p
              id="signup-confirm-password-description"
              className="mb-1 text-left text-xs text-gray-500 dark:text-gray-400"
            >
              {" "}
              Re-enter your password to confirm it.{" "}
            </p>{" "}
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                clearFieldError("confirmPassword");
              }}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword
                  ? "signup-confirm-password-description signup-confirm-password-error"
                  : "signup-confirm-password-description"
              }
              className={`w-full rounded-lg border px-3 py-[7px] text-sm dark:bg-gray-800 dark:text-white ${errors.confirmPassword ? "border-red-500 dark:border-red-500" : "dark:border-gray-700"}`}
              placeholder="••••••••"
              autoComplete="new-password"
            />{" "}
            {errors.confirmPassword && (
              <p
                id="signup-confirm-password-error"
                role="alert"
                className="mt-1 text-left text-xs text-red-600 dark:text-red-400"
              >
                {" "}
                {errors.confirmPassword}{" "}
              </p>
            )}{" "}
          </div>{" "}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-[7px] text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {" "}
            {loading ? "Creating account..." : "Sign up"}{" "}
          </button>{" "}
        </form>{" "}
        <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
          {" "}
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 dark:text-blue-400"
          >
            {" "}
            Login{" "}
          </Link>{" "}
        </p>{" "}
        <div
          className="my-4 flex items-center gap-3"
          role="separator"
          aria-label="Social signup options"
        >
          {" "}
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />{" "}
          <span className="text-xs text-gray-500 dark:text-gray-400"> OR </span>{" "}
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />{" "}
        </div>{" "}
        {/* Social signup */}{" "}
        <div className="space-y-2.5">
          {" "}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            aria-label="Continue signup with Google"
            className="w-full rounded-lg border px-4 py-[7px] text-sm disabled:opacity-50 dark:border-gray-700 dark:text-white"
          >
            {" "}
            Continue with Google{" "}
          </button>{" "}
          <button
            type="button"
            onClick={handleGithubSignup}
            disabled={loading}
            aria-label="Continue signup with GitHub"
            className="w-full rounded-lg border px-4 py-[7px] text-sm disabled:opacity-50 dark:border-gray-700 dark:text-white"
          >
            {" "}
            Continue with GitHub{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default Signup;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { supabase } from '../../lib/supabaseClient';

function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error(
        'Password must be at least 6 characters'
      );
      return;
    }

    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (error) {
        throw error;
      }

      /*
       * Depending on your Supabase email confirmation
       * settings, session may be null here.
       */

      if (data.session) {
        toast.success('Account created successfully');
        navigate('/dashboard');
      } else {
        toast.success(
          'Account created. Check your email to confirm your account.'
        );

        navigate('/login');
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.message || 'Unable to create account'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    try {
      setLoading(true);

      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.message || 'Google signup failed'
      );

      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow dark:bg-gray-900">
        <h1 className="mb-2 text-2xl font-bold">
          Create account
        </h1>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Start learning SQL with SQL Coach.
        </p>

        <form
          onSubmit={handleSignup}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Confirm password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />

          <span className="text-sm text-gray-500">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full rounded-lg border px-4 py-2 disabled:opacity-50 dark:border-gray-700"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
// frontend/src/pages/AuthCallback.jsx

import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';

function AuthCallback() {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isAuthenticated) {
      navigate({
        to: '/dashboard',
        replace: true,
      });
    } else {
      navigate({
        to: '/login',
        replace: true,
      });
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Completing login...</p>
    </div>
  );
}

export default AuthCallback;
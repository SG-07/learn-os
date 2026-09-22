import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthCallback() {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }

    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [
    loading,
    isAuthenticated,
    navigate,
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Completing login...</p>
    </div>
  );
}

export default AuthCallback;
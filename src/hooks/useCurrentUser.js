import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

export const useCurrentUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await authApi.me();
      if (data.success && data.user) {
        const u = data.user;
        setUser({
          ...u,
          id: u.id || u._id?.toString?.() || u._id,
        });
      }
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to load profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { user, loading, error, refetch };
};

export default useCurrentUser;

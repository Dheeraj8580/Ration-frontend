import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, adminApi, setAuthToken } from '../services/api';

const AuthContext = createContext();

const normalizeUser = (u) => {
  if (!u) return null;
  return {
    ...u,
    id: u.id?.toString?.() || u._id?.toString?.() || u._id,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const persistUser = useCallback((userData) => {
    const normalized = normalizeUser(userData);
    setUser(normalized);
    if (normalized) {
      localStorage.setItem('user', JSON.stringify(normalized));
    }
    return normalized;
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    setAuthToken(token);
    const { data } = await authApi.me();
    if (data.success && data.user) {
      return persistUser(data.user);
    }
    return null;
  }, [persistUser]);

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      setAuthToken(storedToken);
      try {
        await fetchCurrentUser();
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [fetchCurrentUser]);

  const login = async (userData, token) => {
    if (token) setAuthToken(token);
    setIsLoggedIn(true);
    try {
      return await fetchCurrentUser();
    } catch {
      return persistUser(userData);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    setAuthToken(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isShopOwner = () => user?.role === 'shop_owner';
  const isShopApproved = () =>
    user?.role === 'shop_owner' && user?.shopOwnerStatus === 'Approved';

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    if (requiredRole === 'admin') return user.role === 'admin';
    if (requiredRole === 'shop_owner') return user.role === 'shop_owner';
    if (requiredRole === 'user') return user.role === 'user';
    return true;
  };

  const authenticateUser = async (email, password, role = 'user') => {
    try {
      const { data } = await authApi.login(email, password, role);
      if (!data.success) {
        return { success: false, error: data.message || 'Login failed.' };
      }
      const loggedIn = await login(data.user, data.token);
      return { success: true, user: loggedIn || data.user };
    } catch (error) {
      return {
        success: false,
        error: error.friendlyMessage || error.response?.data?.message || 'Unable to connect to the server.',
      };
    }
  };

  const registerUser = async (userData, profilePhotoFile) => {
    try {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (value != null && value !== '') formData.append(key, value);
      });
      if (profilePhotoFile) formData.append('profilePhoto', profilePhotoFile);

      const { data } = await authApi.register(formData);
      if (!data.success) {
        return { success: false, error: data.message || 'Registration failed.' };
      }
      await login(data.user, data.token);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.friendlyMessage || 'Registration failed.' };
    }
  };

  const registerShopOwner = async (body) => {
    try {
      const { data } = await authApi.registerShop(body);
      if (!data.success) return { success: false, error: data.message };
      await login(data.user, data.token);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.friendlyMessage || 'Registration failed.' };
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await authApi.users();
      return data;
    } catch (error) {
      return { success: false, error: error.friendlyMessage };
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { data } = await authApi.deleteUser(userId);
      return data;
    } catch (error) {
      return { success: false, error: error.friendlyMessage };
    }
  };

  const updateCardType = async (userId, cardType) => {
    try {
      const { data } = await authApi.updateCardType(userId, cardType);
      if (data.success) await fetchCurrentUser();
      return data;
    } catch (error) {
      return { success: false, error: error.friendlyMessage };
    }
  };

  const fetchApplications = async (params = {}) => {
    try {
      const { data } = await adminApi.applications(params);
      return data;
    } catch (error) {
      return { success: false, error: error.friendlyMessage };
    }
  };

  const fetchAdminStats = async () => {
    try {
      const { data } = await adminApi.stats();
      return data;
    } catch (error) {
      return { success: false, error: error.friendlyMessage };
    }
  };

  const approveApplication = async (id, rationCardType) => {
    try {
      const { data } = await adminApi.approve(id, { rationCardType });
      return data;
    } catch (error) {
      return { success: false, error: error.friendlyMessage };
    }
  };

  const rejectApplication = async (id, rejectionReason) => {
    try {
      const { data } = await adminApi.reject(id, { rejectionReason });
      return data;
    } catch (error) {
      return { success: false, error: error.friendlyMessage };
    }
  };

  const submitApplication = async (data, files = {}) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value != null && value !== '') formData.append(key, value);
      });
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });
      const { data: res } = await authApi.apply(formData);
      if (res.success) await fetchCurrentUser();
      return res;
    } catch (error) {
      return { success: false, error: error.friendlyMessage || 'Application failed.' };
    }
  };

  const fetchShopOwners = async () => {
    try {
      const { data } = await adminApi.shopOwners();
      return data;
    } catch (error) {
      return { success: false, error: error.friendlyMessage };
    }
  };

  const approveShopOwner = async (id) => {
    try {
      const { data } = await adminApi.approveShopOwner(id);
      return data;
    } catch (error) {
      return { success: false, error: error.friendlyMessage };
    }
  };

  const rejectShopOwner = async (id, rejectionReason) => {
    try {
      const { data } = await adminApi.rejectShopOwner(id, { rejectionReason });
      return data;
    } catch (error) {
      return { success: false, error: error.friendlyMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId: user?.id,
        isLoggedIn,
        isLoading,
        login,
        logout,
        isAdmin,
        isShopOwner,
        isShopApproved,
        hasPermission,
        authenticateUser,
        registerUser,
        registerShopOwner,
        fetchAllUsers,
        deleteUser,
        updateCardType,
        refreshUser: fetchCurrentUser,
        fetchApplications,
        fetchAdminStats,
        approveApplication,
        rejectApplication,
        submitApplication,
        fetchShopOwners,
        approveShopOwner,
        rejectShopOwner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

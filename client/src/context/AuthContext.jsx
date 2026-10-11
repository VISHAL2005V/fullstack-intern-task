import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { favoriteService } from '../services/favoriteService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('templatehub_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('templatehub_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  // Fetch favorite template IDs from backend
  const fetchFavoriteIds = useCallback(async () => {
    if (!token) {
      setFavoriteIds(new Set());
      return;
    }
    try {
      setIsFavoritesLoading(true);
      const res = await favoriteService.getFavoriteIds();
      if (res.success && Array.isArray(res.data)) {
        setFavoriteIds(new Set(res.data));
      }
    } catch (err) {
      console.error('Failed to load favorite IDs:', err);
    } finally {
      setIsFavoritesLoading(false);
    }
  }, [token]);

  // Validate token with /api/auth/me on mount or token change
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('templatehub_token');
      if (savedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('templatehub_user', JSON.stringify(res.data.user));
            // Load favorite IDs for this authenticated user
            await fetchFavoriteIds();
          } else {
            logout();
          }
        } catch (error) {
          // Token invalid or expired
          console.warn('Authentication token validation failed:', error.message);
          logout();
        }
      } else {
        setUser(null);
        setFavoriteIds(new Set());
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for unauthorized events emitted by api interceptor
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setFavoriteIds(new Set());
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [fetchFavoriteIds]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('templatehub_token', newToken);
        localStorage.setItem('templatehub_user', JSON.stringify(userData));

        // Immediately fetch user favorite IDs
        try {
          const favRes = await favoriteService.getFavoriteIds();
          if (favRes.success && Array.isArray(favRes.data)) {
            setFavoriteIds(new Set(favRes.data));
          }
        } catch (favErr) {
          console.warn('Initial favorites fetch failed:', favErr.message);
        }

        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const res = await authService.register({ name, email, password });
      if (res.success && res.data) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('templatehub_token', newToken);
        localStorage.setItem('templatehub_user', JSON.stringify(userData));
        setFavoriteIds(new Set());

        toast.success(`Welcome to TemplateHub, ${userData.name}!`);
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    setToken(null);
    setUser(null);
    setFavoriteIds(new Set());
    localStorage.removeItem('templatehub_token');
    localStorage.removeItem('templatehub_user');
  };

  // Check if a template is favorited
  const isFavorite = useCallback(
    (templateId) => {
      if (!templateId) return false;
      return favoriteIds.has(templateId.toString());
    },
    [favoriteIds]
  );

  // Toggle favorite with optimistic UI update and network failure rollback
  const toggleFavorite = async (templateId) => {
    if (!token || !user) {
      toast.error('Please log in to add templates to your favorites.', { id: 'login-required' });
      return { success: false, requiresAuth: true };
    }

    const idStr = templateId.toString();
    const currentlyFav = favoriteIds.has(idStr);

    // Optimistically update
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (currentlyFav) {
        next.delete(idStr);
      } else {
        next.add(idStr);
      }
      return next;
    });

    try {
      if (currentlyFav) {
        const res = await favoriteService.removeFavorite(idStr);
        if (res.success) {
          toast.success('Removed from your favorites', { id: `fav-${idStr}` });
          return { success: true, action: 'removed' };
        }
      } else {
        const res = await favoriteService.addFavorite(idStr);
        if (res.success) {
          toast.success('Added to your favorites!', { id: `fav-${idStr}` });
          return { success: true, action: 'added' };
        }
      }
    } catch (error) {
      // Rollback optimistic update on error
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (currentlyFav) {
          next.add(idStr);
        } else {
          next.delete(idStr);
        }
        return next;
      });
      const errorMsg = error.response?.data?.message || 'Failed to update favorites. Please try again.';
      toast.error(errorMsg, { id: `fav-err-${idStr}` });
      return { success: false, message: errorMsg };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    favoriteIds,
    isFavoritesLoading,
    isFavorite,
    toggleFavorite,
    fetchFavoriteIds,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

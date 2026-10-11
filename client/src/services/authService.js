import api from './api';

export const authService = {
  // Register a new user
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Login existing user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Verify and fetch current user profile
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

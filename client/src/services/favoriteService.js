import api from './api';

export const favoriteService = {
  // Fetch list of populated favorites for current user
  async getFavorites() {
    const response = await api.get('/favorites');
    return response.data;
  },

  // Fetch array of favorite template IDs for quick lookup
  async getFavoriteIds() {
    const response = await api.get('/favorites/ids');
    return response.data;
  },

  // Add template to favorites
  async addFavorite(templateId) {
    const response = await api.post(`/favorites/${templateId}`);
    return response.data;
  },

  // Remove template from favorites
  async removeFavorite(templateId) {
    const response = await api.delete(`/favorites/${templateId}`);
    return response.data;
  },
};

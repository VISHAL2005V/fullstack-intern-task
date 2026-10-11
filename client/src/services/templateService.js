import api from './api';

export const templateService = {
  // Fetch templates with search, category, and sort parameters
  async getTemplates(params = {}) {
    const response = await api.get('/templates', { params });
    return response.data;
  },

  // Fetch individual template details by ID
  async getTemplateById(id) {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },
};

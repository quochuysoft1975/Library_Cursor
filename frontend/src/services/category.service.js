import api from './api';

export const categoryService = {
  /**
   * Get all categories
   * @param {Object} params - Query parameters
   * @param {string} params.search - Search term
   * @param {string} params.sortBy - Sort field (name, books_count)
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getAllCategories: async (params = {}) => {
    const response = await api.get('/categories', { params });
    return response.data;
  },

  /**
   * Create a new category
   * @param {Object} data - Category data
   * @param {string} data.name - Category name
   * @param {string} data.description - Category description (optional)
   * @returns {Promise} API response
   */
  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  /**
   * Update a category
   * @param {string} id - Category ID
   * @param {Object} data - Category data
   * @param {string} data.name - Category name
   * @param {string} data.description - Category description (optional)
   * @returns {Promise} API response
   */
  updateCategory: async (id, data) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete a category
   * @param {string} id - Category ID
   * @returns {Promise} API response
   */
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export default categoryService;


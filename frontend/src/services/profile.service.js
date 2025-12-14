import api from './api';

export const profileService = {
  /**
   * Get current user profile
   * @returns {Promise} API response
   */
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data
   * @param {string} data.name - User name
   * @param {string} data.phone - User phone
   * @param {string} data.address - User address
   * @returns {Promise} API response
   */
  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
  },

  /**
   * Change user password
   * @param {Object} data - Password data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @param {string} data.confirmPassword - Confirm new password
   * @returns {Promise} API response
   */
  changePassword: async (data) => {
    const response = await api.put('/profile/password', data);
    return response.data;
  }
};

export default profileService;


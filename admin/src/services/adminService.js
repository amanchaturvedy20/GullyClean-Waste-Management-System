import api from '../api/api';

const adminService = {
  // Fetch overview stats
  getAdminStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Fetch worker specific performance stats
  getWorkerStats: async () => {
    const response = await api.get('/admin/worker-stats');
    return response.data;
  }
};

export default adminService;

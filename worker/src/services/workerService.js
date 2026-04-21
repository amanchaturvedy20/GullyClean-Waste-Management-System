import api from '../api/api';

const workerService = {
  // Fetch assigned pickups
  getAssignedTasks: async () => {
    const response = await api.get('/worker/tasks');
    return response.data;
  },

  // Fetch worker stats
  getWorkerStats: async () => {
    const response = await api.get('/worker/stats');
    return response.data;
  },

  // Complete a pickup
  completePickup: async (taskId, photoFile, coordinates) => {
    // 1. Upload photo
    const formData = new FormData();
    formData.append('image', photoFile);

    const uploadRes = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-upload-context': `WORKER-Task-${taskId}`,
      },
    });
    
    const imageUrl = uploadRes.data.imageUrl;

    // 2. Mark complete
    const response = await api.put(`/worker/pickups/${taskId}/complete`, {
      workerPhoto: imageUrl,
      coordinates: coordinates
    });
    
    return response.data;
  },

  // Update real-time worker location/status
  updateLocation: async (lat, lng, isTracking) => {
    const response = await api.put('/worker/location', { lat, lng, isTracking });
    return response.data;
  },
};

export default workerService;

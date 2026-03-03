import api from '@/services/api';

const userService = {
    getProfile: (id) => api.get(`/users/${id}`),
    followUser: (id) => api.post(`/users/${id}/follow`),
    updateProfile: (id, data) => api.put(`/users/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default userService;

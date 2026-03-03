import api from '@/services/api';

const blogService = {
    // Blog CRUD
    getAll: (params) => api.get('/blogs', { params }),
    getById: (id) => api.get(`/blogs/${id}`),
    create: (data) => api.post('/blogs', data, {
        headers: { 'Content-Type': 'multipart/form-data' } 
    }),
    update: (id, data) => api.put(`/blogs/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/blogs/${id}`),

    // Interactions
    incrementView: (id) => api.post(`/blogs/${id}/view`),
    toggleLike: (id) => api.post(`/blogs/${id}/likes`),
    toggleSave: (id) => api.post(`/blogs/${id}/save`),

    // Reviews
    addComment: (id, commentData) => api.post(`/blogs/${id}/reviews`, commentData),
    deleteComment: (id, reviewId) => api.delete(`/blogs/${id}/reviews/${reviewId}`),

    // AI
    generateContent: (params) => api.post('/blogs/ai/generate', params),
};

export default blogService;

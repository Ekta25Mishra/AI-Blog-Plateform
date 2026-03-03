import api from '@/services/api';

const authService = {
    getCurrentUser: () => api.get('/current_user'),
    login: (credentials) => api.post('/login', credentials),
    signup: (userData) => api.post('/signup', userData),
    logout: () => api.get('/logout'),
};

export default authService;

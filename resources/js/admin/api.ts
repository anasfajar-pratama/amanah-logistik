import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    withCredentials: true,
    withXSRFToken: true,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    r => r,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(err);
    }
);

export default api;

export const login = (email: string, password: string) =>
    api.post('/admin/login', { email, password }).then(r => r.data);

export const logout = () => api.post('/admin/logout').then(r => r.data);
export const getUser = () => api.get('/admin/user').then(r => r.data);

export const getSettings = () => api.get('/admin/settings').then(r => r.data);
export const updateSettings = (settings: Record<string, string>) =>
    api.put('/admin/settings', { settings }).then(r => r.data);

export const getHomepage = () => api.get('/admin/homepage').then(r => r.data);
export const updateHomepage = (data: FormData) =>
    api.post('/admin/homepage', data).then(r => r.data);

export const getServices = () => api.get('/admin/services').then(r => r.data);
export const createService = (data: FormData) =>
    api.post('/admin/services', data).then(r => r.data);
export const updateService = (id: number, data: FormData) =>
    api.post(`/admin/services/${id}`, data).then(r => r.data);
export const deleteService = (id: number) => api.delete(`/admin/services/${id}`).then(r => r.data);

export const getAbout = () => api.get('/admin/about').then(r => r.data);
export const updateAbout = (data: FormData) =>
    api.post('/admin/about', data).then(r => r.data);

export const getAdvantages = () => api.get('/admin/advantages').then(r => r.data);
export const createAdvantage = (data: object) => api.post('/admin/advantages', data).then(r => r.data);
export const updateAdvantage = (id: number, data: object) => api.put(`/admin/advantages/${id}`, data).then(r => r.data);
export const deleteAdvantage = (id: number) => api.delete(`/admin/advantages/${id}`).then(r => r.data);

export const getContact = () => api.get('/admin/contact').then(r => r.data);
export const updateContact = (data: object) =>
    api.post('/admin/contact', data).then(r => r.data);

export const getGalleries = () => api.get('/admin/galleries').then(r => r.data);
export const createGallery = (data: FormData) =>
    api.post('/admin/galleries', data).then(r => r.data);
export const updateGallery = (id: number, data: FormData) =>
    api.post(`/admin/galleries/${id}`, data).then(r => r.data);
export const deleteGallery = (id: number) => api.delete(`/admin/galleries/${id}`).then(r => r.data);

export const getSubmissions = (page = 1) => api.get('/admin/submissions', { params: { page } }).then(r => r.data);
export const markSubmissionRead = (id: number) => api.put(`/admin/submissions/${id}/read`).then(r => r.data);
export const deleteSubmission = (id: number) => api.delete(`/admin/submissions/${id}`).then(r => r.data);

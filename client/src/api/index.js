import api from './axiosClient';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const productApi = {
  getAll: () => api.get('/products'),
  getAllAdmin: () => api.get('/products/admin/all'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};

export const orderApi = {
  create: (data) => api.post('/orders', data),
  getAll: (status) => api.get('/orders', { params: status ? { status } : {} }),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  remove: (id) => api.delete(`/orders/${id}`),
};

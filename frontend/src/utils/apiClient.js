import api from '../api/axios';

export default {
  // Auth
  login: (email, password) => api.post('/auth/signin', { email, password }),
  signup: (userData) => api.post('/auth/signup', userData),
  
  // Products
  getProducts: (params = '') => api.get(`/products${params}`),
  getProduct: (id) => api.get(`/products/${id}`),
  
  // User
  getUser: () => api.get('/users/me'),
  updateUser: (data) => api.put('/users/me', data),
  
  // Addresses
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  setDefaultAddress: (id) => api.put(`/users/addresses/${id}/default`),
  
  // Orders
  getOrders: () => api.get('/payment/my-orders'),
  createOrder: (data) => api.post('/payment/create-order', data),
  
  // Admin
  getAdminProducts: () => api.get('/admin/products'),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  getAdminOrders: (status) => 
    api.get(status === 'all' ? '/admin/orders' : `/admin/orders?status=${status}`),
  updateOrderStatus: (orderId, status) => 
    api.put(`/admin/orders/${orderId}/status`, { status })
};

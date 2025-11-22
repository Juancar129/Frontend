import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
});

// Cargar token desde localStorage si existe
export function loadToken() {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

// Login / Register
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  profile: () => api.get('/users/profile'),
};

// Products
export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
};

// Cart
export const cartApi = {
  add: (data) => api.post('/cart/add', data),
};

// Orders
export const ordersApi = {
  create: (data) => api.post('/orders', data),
};

// PayPal
export const paypalApi = {
  createOrder: (data) => api.post('/paypal/create', data),
  captureOrder: (orderId) => api.post(`/paypal/capture/${orderId}`),
};

export default api;

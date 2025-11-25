import axios from "axios";

const API_URL = "http://localhost:3000";

export const loadToken = () => localStorage.getItem("token");
export const saveToken = (token: string) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = loadToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const API = api;

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  saveToken(res.data.token);
  return res.data;
};

export const register = async (name: string, email: string, password: string) => {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/app/profile"); // según dijiste que es “app/profile”
  return res.data;
};

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProduct = async (product: { name: string; description: string; price: number; stock: number }) => {
  const res = await api.post("/products", product);
  return res.data;
};

export const addToCart = async (productId: number, quantity: number) => {
  const res = await api.post("/cart/add", { productId, quantity });
  return res.data;
};

export const createOrder = async (items: any[], total: number) => {
  const res = await api.post("/orders", { items, total });
  return res.data;
};

export const paypalCreate = async (total: number) => {
  const res = await api.post("/paypal/create", { total });
  return res.data;
};

export const paypalCapture = async (orderId: string) => {
  const res = await api.post(`/paypal/capture/${orderId}`);
  return res.data;
};

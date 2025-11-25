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
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const API = api;

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  saveToken(res.data.token);
  return res.data;
};

export const register = async (email: string, password: string) => {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
};

export const getProfile = async () => (await api.get("/users/profile")).data;
export const getProducts = async () => (await api.get("/products")).data;
export const addToCart = async (productId: number, quantity: number) =>
  (await api.post("/cart/add", { productId, quantity })).data;
export const createOrder = async (items: any[], total: number) =>
  (await api.post("/orders", { items, total })).data;

export const paypalCreate = async (total: number) =>
  (await api.post("/paypal/create", { total })).data;

export const paypalCapture = async (orderId: string) =>
  (await api.post(`/paypal/capture/${orderId}`)).data;


export const productsApi = {
  create: async (data: any) => {
    const res = await api.post("/products", data);
    return res.data;
  },

  getAll: async () => {
    const res = await api.get("/products");
    return res.data;
  }
};
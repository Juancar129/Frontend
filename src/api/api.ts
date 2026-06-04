import axios from "axios";

const API_URL = "http://localhost:3333/api";
const TOKEN_KEY = "access_token";

export const loadToken = () => localStorage.getItem(TOKEN_KEY);

export const saveToken = (token: string) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
};

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = loadToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

export const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    saveToken(res.data.access_token);
    return res.data;
};

export const register = async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });
    saveToken(res.data.access_token);
    return res.data;
};

export const getProfile = async () => {
    const res = await api.get("/users/profile");
    return res.data;
};

export const getProducts = async () => {
    const res = await api.get("/products");
    return res.data;
};

export const createProduct = async (productData: FormData) => {
    const res = await api.post("/products", productData);
    return res.data;
};

export const updateProduct = async (
    id: number,
    productData: {
        name: string;
        description: string;
        price: number;
        stock: number;
        category: string;
        categoria: string;
    },
) => {
    const res = await api.patch(`/products/${id}`, productData);
    return res.data;
};

export const deleteProduct = async (id: number) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
};

export const addToCart = async (productId: number) => {
    const res = await api.post(`/cart/add/${productId}`);
    return res.data;
};

export const getCart = async () => {
    const res = await api.get("/cart");
    return res.data;
};

export const removeFromCart = async (productId: number) => {
    const res = await api.delete(`/cart/remove/${productId}`);
    return res.data;
};

export const clearBackendCart = async () => {
    const res = await api.delete("/cart/clear");
    return res.data;
};

export const getOrders = async () => {
    const res = await api.get("/orders");
    return res.data;
};

export const getAdminOrders = async () => {
    const res = await api.get("/orders/admin");
    return res.data;
};

export const getAdminOrderById = async (id: number) => {
    const res = await api.get(`/orders/admin/${id}`);
    return res.data;
};

export const updateAdminOrderStatus = async (id: number, status: string) => {
    const res = await api.patch(`/orders/admin/${id}/status`, { status });
    return res.data;
};

export const createOrder = async (
    items: { productId: number; quantity: number; price: number }[],
    total: number,
    shippingData: {
        recipientName: string;
        streetAddress: string;
        city: string;
        postalCode: string;
        country: string;
    },
) => {
    const res = await api.post("/orders", {
        items,
        total,
        ...shippingData,
    });
    return res.data;
};

export const paypalCreate = async (
    total: number,
    items: { productId: number; quantity: number; price: number }[],
    shippingData: {
        recipientName: string;
        streetAddress: string;
        city: string;
        postalCode: string;
        country: string;
    },
) => {
    const res = await api.post("/paypal/create-order", {
        total,
        items,
        ...shippingData,
    });
    return res.data;
};

export const paypalCapture = async (orderId: string) => {
    const res = await api.post(`/paypal/capture/${orderId}`);
    return res.data;
};

export const API = api;
export default api;

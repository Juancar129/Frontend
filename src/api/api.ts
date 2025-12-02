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

// Interceptor para añadir el token de autenticación a cada solicitud
api.interceptors.request.use(
    (config) => {
    const token = loadToken();
    if (token) {
        // Añade el header 'Authorization: Bearer <token>'
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => {
    return Promise.reject(error);
    }
);


// FUNCIONES DE AUTENTICACIÓN Y USUARIO

export const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    saveToken(res.data.access_token); 
    return res.data;
};

export const register = async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });
    return res.data;
};

export const getProfile = async () => {
    const res = await api.get("/users/profile"); 
    return res.data;
};


// FUNCIONES DE PRODUCTOS (CRUD)


// GET /products (Pública)
export const getProducts = async () => {
    const res = await api.get("/products"); 
    return res.data;
};

// POST /products (Requiere Admin)
export const createProduct = async (productData: { 
    name: string; 
    description: string; 
    price: number; 
    stock: number; 
    category: string; 
    images: string[] 
}) => {
    // Nota: El interceptor añade el token, permitiendo el acceso admin
    const res = await api.post("/products", productData);
    return res.data;
};

//PATCH /products/:id (Requiere Admin)
export const updateProduct = async (id: number, productData: any) => {
    const res = await api.patch(`/products/${id}`, productData);
    return res.data;
};

//DELETE /products/:id (Requiere Admin)
export const deleteProduct = async (id: number) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
};



// FUNCIONES DE CARRITO Y ÓRDENES


export const addToCart = async (productId: number, quantity: number) => {
    const res = await api.post("/cart/add", { productId, quantity });
    return res.data;
};

export const createOrder = async (items: any[], total: number) => {
    const res = await api.post("/orders", { items, total });
    return res.data;
};


// FUNCIONES DE PAYPAL


export const paypalCreate = async (total: number) => {
    const res = await api.post("/paypal/create", { total });
    return res.data;
};

export const paypalCapture = async (orderId: string) => {
    const res = await api.post(`/paypal/capture/${orderId}`);
    return res.data;
};


export const API = api;
export default api;
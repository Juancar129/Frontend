import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CreateProduct from "./pages/CreateProduct";
import PaypalSuccess from "./pages/PaypalSuccess";
import CategoryPage from "./pages/CategoryPage";
import Contact from "./pages/Contact";
import Productos from "./pages/Productos"; 
import EditProduct from "./pages/EditProduct"; 
import OrdersDashboard from "./pages/OrdersDashboard"; 


export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />

                <Routes>
                    {/* Rutas Públicas y de Usuario */}
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />

                    {/* PayPal */}
                    <Route path="/paypal/success" element={<PaypalSuccess />} />
                    
          

                    <Route path="/admin" element={<Productos />} /> 
                    
                    {/* Ruta para crear un producto */}
                    <Route path="/admin/products/create" element={<CreateProduct />} />
              
                    <Route path="/admin/products/edit/:id" element={<EditProduct />} /> 
                    
        
                    <Route path="/admin/orders" element={<OrdersDashboard />} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
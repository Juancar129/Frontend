import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AdminRoute, ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/paypal/success" element={<ProtectedRoute><PaypalSuccess /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><Productos /></AdminRoute>} />
                <Route path="/admin/products/create" element={<AdminRoute><CreateProduct /></AdminRoute>} />
                <Route path="/admin/products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><OrdersDashboard /></AdminRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

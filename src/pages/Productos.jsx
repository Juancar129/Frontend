import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getProducts, deleteProduct, API } from '../api/api'; 
import ProductCard from '../components/ProductCard';
import CreateProduct from './CreateProduct'; 

// URL base del backend, necesaria para construir las URLs de las imágenes.
const BASE_URL = "http://localhost:3333"; 

// HOOK SIMULADO: Reemplázalo con tu lógica de autenticación real
const useAuth = () => {
    // Simula que el usuario actual es un administrador
    const simulatedRole = 'admin'; 
    return { role: simulatedRole };
};

export default function Productos() {
    const [products, setProducts] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);  
    const { role } = useAuth(); 
    const navigate = useNavigate(); 


    // --- FUNCIONES DE GESTIÓN ---

    // IMPLEMENTACIÓN: Redirige a la ruta de edición con el ID
    const handleEditProduct = (productId) => {
        navigate(`/admin/products/edit/${productId}`); 
    };

    // IMPLEMENTACIÓN: Redirige a la ruta de órdenes
    const handleViewOrders = () => { 
        navigate('/admin/orders'); 
    };

    const handleCreateProduct = () => { setViewMode('create'); };
    
    const handleBackToGrid = () => {
        setViewMode('grid');
        setError(null); 
    };
    
    const handleDeleteProduct = async (productId) => {
        const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el Producto ID ${productId}?`);
        if (confirmDelete) {
            try {
                await deleteProduct(productId); 
                setProducts(products.filter(p => p.id !== productId));
                alert(`Producto ID ${productId} eliminado con éxito!`);
            } catch (e) {
                alert('Error al eliminar el producto. Verifica tu token o permisos.');
                console.error(e.response?.data || e);
            }
        }
    };


    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await API.get("/products"); 
            
            const processedProducts = res.data.map(product => {
                if (product.images && product.images.length > 0) {
                    product.images = product.images.map(image => ({
                        ...image,
                        fullUrl: `${BASE_URL}${image.url}` 
                    }));
                }
                return product;
            });
            
            setProducts(processedProducts); 
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("No se pudieron cargar los productos. Verifique la conexión con el backend.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (viewMode === 'grid') {
            fetchProducts();
        }
    }, [viewMode]);
    
    // --- RENDERIZADO CONDICIONAL ---

    // Restricción de acceso
    if (role !== 'admin') {
        return (
            <div className="ts-main">
                <h2 style={{ color: '#ef4444' }}>Acceso Denegado 🛑</h2>
                <p style={{ color: '#9ca3af' }}>Solo los administradores pueden acceder a esta interfaz de gestión.</p>
            </div>
        );
    }

    // Renderiza el formulario de creación si el modo es 'create'
    if (viewMode === 'create') {
        return <CreateProduct onCancel={handleBackToGrid} onSuccess={handleBackToGrid} />;
    }

    // Renderizado principal
    return (
        <div className="ts-main">
            <div className="ts-section-header">
                <h2>Gestión de Productos</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleViewOrders} className="ts-btn ts-btn-secondary"><i className="fas fa-shopping-bag"></i> Ver Órdenes</button>
                    <button onClick={handleCreateProduct} className="ts-btn ts-btn-primary"><i className="fas fa-plus"></i> Crear Producto</button>
                </div>
            </div>

            {isLoading && <p style={{ textAlign: 'center' }}>Cargando productos...</p>}
            {error && <p style={{ color: '#ef4444', textAlign: 'center' }}>Error: {error}</p>}
            
            {!isLoading && !error && products.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280' }}>
                    No hay productos disponibles. ¡Usa el botón "Crear Producto" para añadir uno!
                </p>
            )}

            {!isLoading && products.length > 0 && (
                <div className="ts-product-grid">
                    {products.map(p => 
                        <ProductCard 
                            key={p.id} 
                            product={p} 
                            isAdmin={true} 
                            onEdit={() => handleEditProduct(p.id)} 
                            onDelete={() => handleDeleteProduct(p.id)}
                        />
                    )}
                </div>
            )}
        </div>
    )
}
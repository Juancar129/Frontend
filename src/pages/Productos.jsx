
import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../api/api'; 
import ProductCard from '../components/ProductCard';
import CreateProduct from './CreateProduct'; 

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

  // --- FUNCIONES DE GESTIÓN ---

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el Producto ID ${productId}?`);
    if (confirmDelete) {
        try {
            // Asegúrate de que deleteProduct existe en tu API
            await deleteProduct(productId); 
            setProducts(products.filter(p => p.id !== productId));
            alert(`Producto ID ${productId} eliminado con éxito!`);
        } catch (e) {
            alert('Error al eliminar el producto. Verifica tu token o permisos.');
            console.error(e.response?.data || e);
        }
    }
  };

  const handleEditProduct = (productId) => {
    // Implementa la navegación a tu formulario de edición (ej. /admin/products/edit/1)
    console.log(`Función pendiente: Redirigir a la edición del Producto ID ${productId}`);
  };

  const handleCreateProduct = () => { setViewMode('create'); };
  const handleViewOrders = () => { console.log("Función pendiente: Ver órdenes"); };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setError(null); 
    // fetchProducts() se llamará automáticamente en el useEffect
  };
  
  // FUNCIÓN DE FETCH
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Asegúrate de que getProducts devuelve un array de productos
      const res = await getProducts();  
      setProducts(res); 
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("No se pudieron cargar los productos. Verifique la conexión con el backend.");
    } finally {
      setIsLoading(false);
    }
  };
  // -----------------------------

  useEffect(() => {
    if (viewMode === 'grid') {
      fetchProducts();
    }
  }, [viewMode]);
  
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
      
      {/* Mensaje si la lista está vacía */}
      {!isLoading && !error && products.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '40px', color: '#6b7280' }}>
          No hay productos disponibles. ¡Usa el botón "Crear Producto" para añadir uno!
        </p>
      )}

      {/* 🟢 ZONA DE RENDERIZADO CORREGIDA */}
      {!isLoading && products.length > 0 && (
        <div className="ts-product-grid">
          {products.map(p => 
            <ProductCard 
              key={p.id} 
              // 🛑 CLAVE: Pasamos el objeto 'p' como la prop 'product'
              product={p} 
              
              // 🛑 PROPS DE ADMINISTRACIÓN:
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
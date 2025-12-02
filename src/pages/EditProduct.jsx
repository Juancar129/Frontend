// src/pages/EditProduct.jsx (CÓDIGO FINAL)

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../api/api'; 
import ProductForm from '../components/ProductForm'; 

const BASE_URL = "http://localhost:3333"; 

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Cargar los datos del producto existente
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/products/${id}`);
                
                const fetchedProduct = res.data;
                if (fetchedProduct.images) {
                    fetchedProduct.images = fetchedProduct.images.map(img => ({
                        ...img,
                        fullUrl: `${BASE_URL}${img.url}`
                    }));
                }

                setProductData(fetchedProduct);
            } catch (err) {
                console.error("Error al cargar el producto para edición:", err);
                setError("No se pudo cargar el producto. Verifique el ID.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);


    // 2. Función real para guardar los cambios
    const handleSubmit = async (formData, selectedFiles) => {
        console.log(`Enviando actualización para ID ${id}:`, formData, "Nuevos archivos:", selectedFiles);
        
        // Aquí implementarías la llamada API.patch o API.put con el objeto FormData si hay archivos.
        
        try {
            // Ejemplo de llamada (DEBES IMPLEMENTAR EL MANEJO DE IMÁGENES Y DATA)
            // await API.patch(`/products/${id}`, formData); 
            
            alert(`Producto ID ${id} actualizado con éxito! (Simulación)`);
            navigate('/admin'); // Regresar al dashboard de productos
        } catch (e) {
            alert('Error al actualizar el producto.');
            console.error(e);
        }
    };

    if (isLoading) return <div className="ts-main"><p>Cargando datos del producto...</p></div>;
    if (error) return <div className="ts-main"><p style={{ color: '#ef4444' }}>{error}</p></div>;
    if (!productData) return <div className="ts-main"><p>Producto no encontrado.</p></div>;


    return (
        <div className="ts-main">
            <h1>Editar Producto</h1>
            <p>Asegúrate de que la información sea correcta antes de guardar.</p>

            <ProductForm 
                initialData={productData} 
                onSubmit={handleSubmit} 
                onCancel={() => navigate('/admin')}
                isEditing={true} // Marcamos que estamos en modo edición
            />
            
            {/* El botón de cancelar está ahora dentro de ProductForm, puedes eliminar este: */}
            {/* <button onClick={() => navigate('/admin')} className="ts-btn ts-btn-secondary">
                Cancelar y volver al Dashboard
            </button>
            */}
        </div>
    );
}
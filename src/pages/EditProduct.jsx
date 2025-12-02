import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API } from '../api/api'; 
// Asume que esta ruta es correcta para tu proyecto
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
                
                // Procesar URLs de imagen para mostrarlas en la edición
                const fetchedProduct = res.data;
                if (fetchedProduct.images) {
                    fetchedProduct.images = fetchedProduct.images.map(img => ({
                        ...img,
                        fullUrl: `${BASE_URL}${img.url}` // <-- ¡Aquí se crea la URL completa!
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


    // 2. Función para guardar los cambios (Lógica de la API)
    // Recibe el objeto FormData construido en ProductForm.
    const handleSubmit = async (dataToSend) => {
        console.log('Intentando actualizar producto ID:', id, 'con FormData.');
        
        try {
            // Usamos API.patch para enviar la data de actualización y los archivos.
            // Axios/el navegador establecerá automáticamente el 'Content-Type' como 
            // 'multipart/form-data' al enviar un objeto FormData.
            const res = await API.patch(`/products/${id}`, dataToSend); 
            
            console.log("Actualización exitosa:", res.data);
            alert(`Producto ID ${id} actualizado con éxito!`);
            navigate('/admin'); // Redirigir al dashboard
        } catch (e) {
            console.error("Error al actualizar el producto:", e);
            alert('Error al actualizar el producto. Consulte la consola para más detalles.');
        }
    };

    // 3. Manejo de estados de carga y error
    if (isLoading) return <div className="ts-main"><p>Cargando datos del producto...</p></div>;
    if (error) return <div className="ts-main"><p style={{ color: '#ef4444' }}>{error}</p></div>;
    if (!productData) return <div className="ts-main"><p>Producto no encontrado.</p></div>;


    // 4. Renderizado con ProductForm
    return (
        <div className="ts-main">
            <h1>Editar Producto: {productData.name} (ID: {id})</h1>

            <ProductForm 
                initialData={productData} 
                onSubmit={handleSubmit} 
                onCancel={() => navigate('/admin')}
                isEditing={true} 
            />
        </div>
    );
}
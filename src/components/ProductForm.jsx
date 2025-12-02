import { useState, useEffect } from 'react';

// Valores iniciales por defecto (útiles para la creación)
const DEFAULT_PRODUCT_STATE = {
    name: '',
    description: '',
    price: 0,
    category: '', 
};

// Componente de formulario reutilizable para crear y editar
export default function ProductForm({ initialData = DEFAULT_PRODUCT_STATE, onSubmit, onCancel, isEditing = false }) {
    
    // Estados principales
    const [formData, setFormData] = useState(initialData);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Estado para manejar qué imágenes existentes se quieren eliminar
    const [imagesToDelete, setImagesToDelete] = useState([]); 
    
    // 1. Sincronización de Datos (para el modo Edición)
    useEffect(() => {
        // Inicializa el estado local con los datos cargados del producto.
        setFormData(initialData);
        // Resetea las imágenes a eliminar al cargar nuevos datos.
        setImagesToDelete([]); 
    }, [initialData]);

    // 2. Manejo de cambios en campos de texto/número
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        // Convertir precio a número si es un campo de tipo 'number'
        const newValue = type === 'number' ? parseFloat(value) : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    // 3. Manejo de cambios en archivos
    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    // 4. Marcar/desmarcar una imagen existente para eliminación
    const handleRemoveExistingImage = (imageId) => {
        setImagesToDelete(prev => {
            if (prev.includes(imageId)) {
                // Si ya está en la lista, la quitamos (deshacer eliminación)
                return prev.filter(id => id !== imageId);
            } else {
                // Si no está, la agregamos (marcar para eliminación)
                return [...prev, imageId];
            }
        });
    };

    // 5. Manejo del Envío (Construcción de FormData)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const dataToSend = new FormData();
        
        // A. Agregar campos de texto/número
        // Enviamos el resto del formulario como JSON serializado
        dataToSend.append('data', JSON.stringify({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            category: formData.category, 
            // Incluye todos los demás campos de texto/número
        }));
        
        // B. Agregar archivos (Imágenes) nuevas
        selectedFiles.forEach((file) => {
            dataToSend.append(`files`, file); 
        });

        // C. Agregar la lista de IDs de las imágenes a ELIMINAR
        dataToSend.append('images_to_delete', JSON.stringify(imagesToDelete));

        // D. Agregar la lista de URLs/IDs de las imágenes a MANTENER
        // Filtramos las imágenes que *no* están en la lista de eliminación
        const imagesToKeep = (formData.images || [])
            .filter(img => !imagesToDelete.includes(img.id))
            .map(img => img.url); // Enviamos la URL original al backend

        dataToSend.append('images_to_keep', JSON.stringify(imagesToKeep));


        // Llamar a la función onSubmit del padre (EditProduct)
        await onSubmit(dataToSend); 
        
        setIsSubmitting(false);
    };

    // 6. Renderizado
    return (
        <form onSubmit={handleSubmit} className="ts-product-form" encType="multipart/form-data">
            
            <h3>{isEditing ? `Editando: ${formData.name}` : "Crear Nuevo Producto"}</h3>

            {/* Campo Nombre */}
            <div className="ts-form-group">
                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Campo Descripción */}
            <div className="ts-form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>

            {/* Campo Precio */}
            <div className="ts-form-group">
                <label htmlFor="price">Precio</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price || 0}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                />
            </div>
            
            {/* Campo Imágenes */}
            <div className="ts-form-group">
                <label htmlFor="images">Imágenes (Máx. 5)</label>

                {/* Visualización y Eliminación de imágenes existentes (solo en edición) */}
                {isEditing && formData.images && formData.images.length > 0 && (
                    <div className="ts-image-preview">
                        <h4>Imágenes Actuales:</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {formData.images.map(img => {
                                const isMarkedForDelete = imagesToDelete.includes(img.id);
                                return (
                                    <div key={img.id} style={{ position: 'relative', opacity: isMarkedForDelete ? 0.5 : 1 }}>
                                        <img 
                                            src={img.fullUrl} 
                                            alt="Producto actual" 
                                            style={{ width: '80px', height: '80px', objectFit: 'cover', border: isMarkedForDelete ? '2px solid red' : '1px solid #ccc' }}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveExistingImage(img.id)}
                                            style={{ position: 'absolute', top: 0, right: 0, background: isMarkedForDelete ? 'green' : 'red', color: 'white', border: 'none', cursor: 'pointer', padding: '2px 4px', fontSize: '10px' }}
                                        >
                                            {isMarkedForDelete ? 'Revertir' : 'X'}
                                        </button>
                                        {isMarkedForDelete && <small style={{ position: 'absolute', bottom: -15, left: 0, color: 'red', fontSize: '10px' }}>Eliminar</small>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                <input
                    type="file"
                    id="images"
                    name="images"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                />
                
                {/* Visualización de archivos seleccionados */}
                {selectedFiles.length > 0 && (
                     <small style={{ display: 'block', marginTop: '5px' }}>
                        Archivos nuevos listos para subir: **{selectedFiles.length}**
                     </small>
                )}
            </div>
            
            {/* Botones */}
            <div className="ts-form-actions">
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="ts-btn ts-btn-secondary"
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    className="ts-btn ts-btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
                </button>
            </div>
        </form>
    );
}
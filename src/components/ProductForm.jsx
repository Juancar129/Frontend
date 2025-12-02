import { useState, useEffect } from 'react';

// Valores iniciales por defecto (útiles para la creación)
const DEFAULT_PRODUCT_STATE = {
    name: '',
    description: '',
    price: 0,
    category: '',
    // ... otros campos
};

// Componente de formulario reutilizable para crear y editar
export default function ProductForm({ initialData = DEFAULT_PRODUCT_STATE, onSubmit, onCancel, isEditing = false }) {
    const [formData, setFormData] = useState(initialData);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Si estamos editando, actualiza el estado local cuando cambie initialData
    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        // En un caso real, manejarías la subida de archivos aquí
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Aquí debes construir el objeto FormData si incluyes archivos
        // Por ahora, solo enviamos los datos del formulario:
        
        await onSubmit(formData, selectedFiles); 
        
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="ts-product-form">
            
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
                <input
                    type="file"
                    id="images"
                    name="images"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                />
                
                {/* Visualización de imágenes existentes (solo en edición) */}
                {isEditing && formData.images && formData.images.length > 0 && (
                    <div className="ts-image-preview">
                        <h4>Imágenes Actuales:</h4>
                        {formData.images.map(img => (
                            <img 
                                key={img.id} 
                                src={img.fullUrl} 
                                alt="Producto actual" 
                                style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '10px' }}
                            />
                        ))}
                    </div>
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
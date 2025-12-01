import { useState } from 'react';
import { createProduct } from '../api/api'; 

export default function CreateProduct({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0.01,
    stock: 0,
    category: '',
    images: ['', '', '', ''], 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Nuevo estado para errores de frontend

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // CORRECCIÓN MEJORADA: Manejar valores vacíos y aplicar lógica DTO
    if (name === 'price' || name === 'stock') {
        
        let numericValue;
        
        // 1. Si el valor es vacío, lo establecemos a 0.
        if (value === '') {
            numericValue = 0; 
        } else {
            // 2. Parsea el valor si no está vacío
            numericValue = name === 'price' ? parseFloat(value) : parseInt(value);
            
            // 3. Control de la regla mínima para el price
            if (name === 'price' && numericValue < 0.01) {
                // Previene el error, pero avisa al usuario
                setErrors(prev => ({ ...prev, price: 'El precio debe ser de 0.01 o más.' }));
            } else if (name === 'stock' && numericValue < 0) {
                 setErrors(prev => ({ ...prev, stock: 'El stock no puede ser negativo.' }));
            } else {
                 setErrors(prev => ({ ...prev, [name]: null })); // Limpia el error si es válido
            }
        }

        setFormData(prev => ({ 
            ...prev, 
            [name]: numericValue // Guarda 0 o el número parseado
        }));
    } else {
        // Manejo normal para strings
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const cleanedImages = formData.images.filter(url => url && url.length > 0);
    
    // 1. Validación Frontend antes de enviar (para evitar el 400 del DTO)
    if (cleanedImages.length < 4) {
        alert('Debes proporcionar al menos 4 URLs de imagen válidas para crear el producto.');
        setLoading(false);
        return;
    }
    
    if (formData.price < 0.01) {
        alert('El precio mínimo para el producto es 0.01.');
        setLoading(false);
        return;
    }
    
    // 2. Construcción explícita del objeto
    const dataToSend = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: cleanedImages, 
    };

    try {
        const newProduct = await createProduct(dataToSend); 
        
        alert(`Producto "${newProduct.name}" creado con éxito!`);
        onSuccess(); 
    } catch (error) {
        let message = 'Error al crear el producto. Consulta la consola.';
        // Esta línea es crucial: si NestJS devuelve un array de errores, lo mostramos.
        if (error.response?.data?.message) {
            message += ` Detalles: ${JSON.response?.data?.message.join(', ')}`; // Usamos join para mostrar el array
        }
        alert(message);
        console.error(error.response?.data || error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="ts-main">
      {/* ... (JSX no modificado para brevedad) ... */}
      <div className="ts-section-header" style={{ marginBottom: '30px' }}>
        <h2>Crear Nuevo Producto</h2>
        <button onClick={onCancel} className="ts-btn ts-btn-outline" disabled={loading}>
          Cancelar
        </button>
      </div>

      <div className="ts-auth-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="ts-auth-form" style={{ gap: '20px' }}>
          
          <div><label className="ts-input-label">Nombre</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="ts-input" required /></div>
          
          <div><label className="ts-input-label">Descripción</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="ts-input" rows="3" required/></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            {/* Campo Precio */}
            <div>
              <label className="ts-input-label">Precio ($)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                className="ts-input" 
                step="0.01" 
                min="0.01" // El HTML min es solo ayuda visual
                required 
              />
              {errors.price && <p style={{color: 'red', fontSize: '12px'}}>{errors.price}</p>}
            </div>
            {/* Campo Stock */}
            <div>
              <label className="ts-input-label">Stock</label>
              <input 
                type="number" 
                name="stock" 
                value={formData.stock} 
                onChange={handleChange} 
                className="ts-input" 
                min="0" 
                required 
              />
              {errors.stock && <p style={{color: 'red', fontSize: '12px'}}>{errors.stock}</p>}
            </div>
            {/* Campo Categoría */}
            <div>
              <label className="ts-input-label">Categoría</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="ts-input" required />
            </div>
          </div>
          
          <p className="ts-input-label" style={{ marginTop: '10px', marginBottom: '5px' }}>Imágenes (Min. 4 URLs)</p>
          {formData.images.map((url, index) => (
             <input 
                key={index}
                type="url" 
                placeholder={`URL de Imagen ${index + 1}`}
                value={url} 
                onChange={(e) => handleImageChange(index, e.target.value)} 
                className="ts-input" 
                required={index < 4} 
            />
          ))}
          
          <button type="submit" className="ts-btn ts-btn-primary ts-btn-full" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </form>
      </div>
    </div>
  );
}
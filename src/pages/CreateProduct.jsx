import React, { useState } from 'react';
import { createProduct } from '../api/api'; 
// Asegúrate de que tu instancia de api use Axios y que createProduct llame a api.post('/products', dataToSend)

export default function CreateProduct({ onCancel, onSuccess }) {
  
  // 1. ESTADO DE DATOS DEL PRODUCTO (DTO: incluye ambos campos de categoría)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0.01, 
    stock: 0,     
    category: '',   // Campo para la lógica interna/filtros
    categoria: '',  // Campo para la visualización/navegación (ej: PCs, Laptops)
  });

  // 2. ESTADO PARA LOS ARCHIVOS BINARIOS
  const [selectedFiles, setSelectedFiles] = useState(null); 
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 3. MANEJADOR PARA CAMPOS DE TEXTO Y NÚMEROS
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors, [name]: null };
    
    if (name === 'price' || name === 'stock') {
      let numericValue = name === 'price' ? parseFloat(value) : parseInt(value);
      
      if (name === 'price' && numericValue < 0.01 && value !== '') {
          newErrors.price = 'El precio debe ser de 0.01 o más.';
      } else if (name === 'stock' && numericValue < 0) {
          newErrors.stock = 'El stock no puede ser negativo.';
      }
      
      setErrors(newErrors);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
      
    } else {
        setErrors(newErrors);
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 4. MANEJADOR PARA CAPTURAR ARCHIVOS BINARIOS
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files); 
    setErrors(prev => ({ ...prev, images: null }));
  };

  // 5. FUNCIÓN DE ENVÍO CON FORM DATA
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    // --- VALIDACIONES ---
    if (!selectedFiles || selectedFiles.length < 4) {
      alert('Debes subir al menos 4 archivos de imagen.');
      setLoading(false);
      return;
    }
    if (formData.price < 0.01) {
        alert('El precio mínimo para el producto es 0.01.');
        setLoading(false);
        return;
    }
    
    // --- CONSTRUCCIÓN DE FORM DATA ---
    const dataToSend = new FormData();
    
    // 1. Añadir campos de texto/número iterando sobre todas las claves
    // (Esto incluye name, description, price, stock, category, y categoria)
    Object.keys(formData).forEach(key => {
        let value = formData[key];
        
        if (key === 'price') {
            value = value.toFixed(2);
        } else if (key === 'stock') {
            value = value.toString();
        }
        
        dataToSend.append(key, value); 
    });
    
    // 2. Añadir archivos
    for (let i = 0; i < selectedFiles.length; i++) {
        dataToSend.append('images', selectedFiles[i]); 
    }

    try {
        const newProduct = await createProduct(dataToSend); 
        
        alert(`Producto "${newProduct.name}" creado con éxito!`);
        onSuccess(); 
    } catch (error) {
        let message = 'Error al crear el producto. Consulta la consola.';
        if (error.response?.data?.message) {
            const details = Array.isArray(error.response.data.message) 
                ? error.response.data.message.join(', ') 
                : error.response.data.message;
            message += ` Detalles: ${details}`;
        }
        alert(message);
        console.error(error.response?.data || error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="ts-main">
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
                min="0.01" 
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
            {/* Campo CATEGORY (Lógica/Filtro) */}
            <div>
              <label className="ts-input-label">Categoría (Filtro)</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} className="ts-input" required />
            </div>
          </div>
          
          <div style={{ padding: '0 0 10px' }}>
              <label className="ts-input-label">Categoría (Visualización UI)</label>
              <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} className="ts-input" required />
          </div>

          {/* INPUT DE ARCHIVO BINARIO */}
          <p className="ts-input-label" style={{ marginTop: '10px', marginBottom: '5px' }}>Imágenes del Producto (Mínimo 4 Archivos)</p>
          <div>
            <input 
              type="file" 
              name="images" 
              className="ts-input" 
              onChange={handleFileChange} 
              multiple 
              accept="image/*" 
              required
            />
          </div>
          {selectedFiles && <p style={{fontSize: '12px', color: 'green'}}>Archivos seleccionados: {selectedFiles.length}</p>}
          
          <button type="submit" className="ts-btn ts-btn-primary ts-btn-full" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </button>
        </form>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

const DEFAULT_PRODUCT_STATE = {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    categoria: "",
};

export default function ProductForm({
    initialData = DEFAULT_PRODUCT_STATE,
    onSubmit,
    onCancel,
    isEditing = false,
}) {
    const [formData, setFormData] = useState(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData({
            ...DEFAULT_PRODUCT_STATE,
            ...initialData,
        });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === "number" ? Number(value) : value;

        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit({
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                stock: Number(formData.stock),
                category: formData.category,
                categoria: formData.categoria,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="ts-product-form">
            <h3>{isEditing ? `Editando: ${formData.name}` : "Crear Nuevo Producto"}</h3>

            <div className="ts-form-group">
                <label htmlFor="name">Nombre</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="ts-form-group">
                <label htmlFor="description">Descripcion</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="ts-form-group">
                <label htmlFor="price">Precio</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price || 0}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                />
            </div>

            <div className="ts-form-group">
                <label htmlFor="stock">Stock</label>
                <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock || 0}
                    onChange={handleChange}
                    min="0"
                    required
                />
            </div>

            <div className="ts-form-group">
                <label htmlFor="category">Categoria interna</label>
                <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category || ""}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="ts-form-group">
                <label htmlFor="categoria">Categoria visible</label>
                <input
                    type="text"
                    id="categoria"
                    name="categoria"
                    value={formData.categoria || ""}
                    onChange={handleChange}
                    required
                />
            </div>

            {isEditing && (
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>
                    La edicion de imagenes no esta disponible con el backend actual.
                </p>
            )}

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
                    {isSubmitting ? "Guardando..." : isEditing ? "Actualizar Producto" : "Crear Producto"}
                </button>
            </div>
        </form>
    );
}

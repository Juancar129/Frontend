import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, updateProduct } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import ProductForm from "../components/ProductForm";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/products/${id}`);
                setProductData(res.data);
            } catch (err) {
                console.error("Error al cargar el producto para edicion:", err);
                setError("No se pudo cargar el producto. Verifica el ID.");
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === "admin") {
            fetchProduct();
        } else {
            setIsLoading(false);
        }
    }, [id, user]);

    const handleSubmit = async (dataToSend) => {
        try {
            const updatedProduct = await updateProduct(Number(id), dataToSend);
            console.log("Actualizacion exitosa:", updatedProduct);
            alert(`Producto ID ${id} actualizado con exito.`);
            navigate("/admin");
        } catch (e) {
            console.error("Error al actualizar el producto:", e);
            alert("Error al actualizar el producto. Consulta la consola para mas detalles.");
        }
    };

    if (!user) {
        return <div className="ts-main"><p>Inicia sesion para editar productos.</p></div>;
    }

    if (user.role !== "admin") {
        return <div className="ts-main"><p style={{ color: "#ef4444" }}>No tienes permisos para editar productos.</p></div>;
    }

    if (isLoading) {
        return <div className="ts-main"><p>Cargando datos del producto...</p></div>;
    }

    if (error) {
        return <div className="ts-main"><p style={{ color: "#ef4444" }}>{error}</p></div>;
    }

    if (!productData) {
        return <div className="ts-main"><p>Producto no encontrado.</p></div>;
    }

    return (
        <div className="ts-main">
            <h1>Editar Producto: {productData.name} (ID: {id})</h1>

            <ProductForm
                initialData={productData}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/admin")}
                isEditing={true}
            />
        </div>
    );
}

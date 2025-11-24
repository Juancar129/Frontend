import { useEffect, useState } from "react";
import { API } from "../api/api";
import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, []);

  if (!product) return <p>Cargando...</p>;

  return (
    <div className="product-detail">
      <img src={product.image || "/placeholder.png"} alt="" />
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h2>${product.price}</h2>
      <button>Añadir al carrito</button>
    </div>
  );
}

import { useState, useEffect } from 'react'
import { productsApi } from '../api/api'
import ProductCard from '../components/ProductCard'

export default function Productos(){
  const [products,setProducts] = useState([])

  useEffect(()=>{
    (async()=>{
      try {
        const res = await productsApi.getAll()
        setProducts(res.data)
      } catch (err){
        console.error(err)
      }
    })()
  },[])

  return (
    <div className="container">
      <div className="header">
        <h2>Catálogo</h2>
        <div>
          <a href="/carrito"><button>Carrito</button></a>
        </div>
      </div>

      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  )
}

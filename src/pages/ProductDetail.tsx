import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { productsApi, cartApi, paypalApi } from '../services/api'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(()=>{
    (async()=>{
      try {
        const res = await productsApi.getById(id)
        setProduct(res.data)
      } catch (err){
        console.error(err)
      }
    })()
  },[id])

  if(!product) return <div className="container">Cargando...</div>

  const add = async () => {
    try {
      await cartApi.add({ productId: product.id, quantity: 1 })
      alert('Agregado al carrito')
    } catch (err) {
      alert(err.response?.data?.message || 'Error')
    }
  }

  const buyNow = async () => {
    try {
      // Crea orden PayPal en backend
      const res = await paypalApi.createOrder({ amount: product.price })
      // backend debería devolver approval_url o id
      const data = res.data
      const approveLink = data.links?.find(l => l.rel === 'approve')?.href
      if(approveLink) window.location.href = approveLink
      else alert('Orden creada: ' + (data.id || JSON.stringify(data)))
    } catch (err){
      alert('Error PayPal')
      console.error(err)
    }
  }

  return (
    <div className="container">
      <div style={{display:'flex', gap:20}}>
        <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} style={{width:400, borderRadius:8}}/>
        <div>
          <h1>{product.name}</h1>
          <h2 style={{color:'#111'}}>${product.price}</h2>
          <p>{product.description}</p>
          <p><b>Stock:</b> {product.stock}</p>
          <div style={{marginTop:12}}>
            <button onClick={add} style={{marginRight:8}}>Agregar al carrito</button>
            <button onClick={buyNow} style={{background:'green'}}>Comprar ahora</button>
          </div>
        </div>
      </div>
    </div>
  )
}

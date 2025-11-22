import { useState, useEffect } from 'react'
import { ordersApi } from '../services/api'

export default function Carrito(){
  const [items, setItems] = useState([])

  // Simple: aquí podrías obtener el carrito desde tu backend, pero ya depende de tu implementación.
  useEffect(()=> {
    const raw = localStorage.getItem('cart') || '[]'
    setItems(JSON.parse(raw))
  },[])

  const checkout = async () => {
    try {
      const total = items.reduce((s,i)=> s + i.price * i.quantity, 0)
      const res = await ordersApi.create({ total, items })
      alert('Orden creada: ' + res.data.id)
      localStorage.removeItem('cart')
      setItems([])
    } catch (err){
      alert('Error creando orden')
    }
  }

  return (
    <div className="container">
      <h2>Carrito</h2>
      {items.length === 0 ? <p>El carrito está vacío</p> : (
        <>
          <ul>
            {items.map((it,idx) => <li key={idx}>{it.name} x {it.quantity} - ${it.price}</li>)}
          </ul>
          <button onClick={checkout}>Pagar</button>
        </>
      )}
    </div>
  )
}

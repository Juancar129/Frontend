import { Link } from 'react-router-dom'
export default function ProductCard({p}){
  return (
    <div className="card">
      <img src={p.image || 'https://via.placeholder.com/300'} alt={p.name} style={{width:'100%', height:160, objectFit:'cover', borderRadius:6}}/>
      <h3>{p.name}</h3>
      <p style={{fontWeight:700}}>${p.price}</p>
      <Link to={`/producto/${p.id}`}><button style={{background:'#333'}}>Ver producto</button></Link>
    </div>
  )
}

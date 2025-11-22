import { useEffect, useState } from 'react'
import { authApi } from '../services/api'

export default function Perfil(){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    (async()=>{
      try {
        const res = await authApi.profile()
        setUser(res.data)
      } catch (err){
        console.error(err)
      }
    })()
  },[])

  if(!user) return <div className="container">Cargando...</div>

  return (
    <div className="container">
      <h2>Perfil</h2>
      <p><b>Nombre:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Rol:</b> {user.role}</p>
    </div>
  )
}

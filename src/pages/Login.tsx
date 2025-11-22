import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()

  const handle = async () => {
    try {
      const res = await authApi.login({ email, password })
      const token = res.data.access_token || res.data.token || res.data.accessToken
      if(token){
        localStorage.setItem('token', token)
        // set default header
        window.location.href = '/productos' // recarga para cargar token
      } else {
        alert('No se recibió token')
      }
    } catch (err){
      alert(err.response?.data?.message || 'Error al loguear')
    }
  }

  return (
    <div className="container">
      <h2>Inicia sesión</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div style={{marginTop:12}}>
        <button onClick={handle}>Entrar</button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { register } from "../api/api";

export default function Registro(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  const handle = async () => {
    try {
      await register(email, password); 
      alert('Registrado, ahora inicia sesión');
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.message || 'Error al registrarte');
    }
  }

  return (
    <div className="container">
      <h2>Registro</h2>

      <input 
        placeholder="Nombre" 
        value={name} 
        onChange={e=>setName(e.target.value)} 
      />

      <input 
        placeholder="Email" 
        value={email} 
        onChange={e=>setEmail(e.target.value)} 
      />

      <input 
        placeholder="Contraseña" 
        type="password" 
        value={password} 
        onChange={e=>setPassword(e.target.value)} 
      />

      <div style={{marginTop:12}}>
        <button onClick={handle}>Registrar</button>
      </div>
    </div>
  )
}

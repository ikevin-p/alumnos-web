import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [alumnos, setAlumnos] = useState([]);

  useEffect(() => {
    // El proxy de Nginx redirige esta petición al Backend en AWS
    axios.get('/alumnos')
      .then(res => setAlumnos(res.data))
      .catch(err => console.log("Esperando conexión al backend...", err));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50' }}>🎓 Gestión de Alumnos - Innovatech Chile</h1>
      <p style={{ color: '#7f8c8d' }}>Sistema React + Vite desplegado en AWS EC2 (Frontend Público)</p>
      
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
        <h3>Base de Datos Actual:</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {alumnos.length > 0 ? alumnos.map(a => (
            <li key={a.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              👤 {a.nombre} {a.apellido}
            </li>
          )) : <li style={{ color: '#e74c3c' }}>Aún no hay conexión con el Backend de Spring Boot.</li>}
        </ul>
      </div>
    </div>
  );
}
export default App;

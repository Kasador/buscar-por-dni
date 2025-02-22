import { useState } from 'react'
import './App.scss'
import { FaSearch } from "react-icons/fa";
import { BiSolidError } from "react-icons/bi";
import axios from 'axios';
import buscar from './assets/img/buscar_v1.gif';

function App() {
  const [dni, setDni] = useState('');
  const [value, setValue] = useState('');
  const [inputValid, setInputValid] = useState(false);
  const [storeDNI, setStoreDNI] = useState([]);
  // const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    const input = e.target.value;
    const regex = /^[0-9]{8}$/;

    if (!regex.test(input)) {
      setInputValid(false);
    } else {
      setDni(input);
      setInputValid(true);
    }
    setValue(input);
  };

  const handleSearchClick = async () => {
    if (!inputValid) return;
    setLoading(true);
    setError('');

    const url = import.meta.env.VITE_API_URL;
    const token = import.meta.env.VITE_API_TOKEN;

    setLoading(true);

    try {
      const response = await axios.post(
          url,
          { dni: dni }, // Data payload
          {
              headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              }
          }
      );

      if (!response.data.success || !response.data.data) {
        setError("DNI no encontrado. Verifique el número e intente nuevamente.");
        setValue(''); // Clear input
        return;
      }

      const newEntry = response.data.data;
      
      const isDuplicate = storeDNI.some(person => person.numero === newEntry.numero);
      if (isDuplicate) {
        setError("Este DNI ya ha sido buscado.");
        setValue(''); // Clear input
        return;
      }
      
      setStoreDNI((prev) => [...prev, newEntry]); // Append new data
      setValue(''); // Clear input
      setInputValid(false);
    } catch (error) {
      setError("Error al buscar el DNI. Intente nuevamente.");
      console.error("API Error:", error);
      setValue('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='MainApp'>
      <h1 className='Title'>Buscar Por DNI</h1>
      <p>Ingrese el DNI de la persona que desea buscar</p>
      
      <form className="Search">
        <input 
          type="text" 
          placeholder="Ingrese DNI (8 dígitos)" 
          value={value} 
          onChange={handleSearch} 
          maxLength="8"
          pattern="[0-9]{8}"
          className={inputValid ? 'bueno' : 'malo'} 
        />
        <FaSearch 
          onClick={handleSearchClick} 
          className={inputValid ? 'allow' : 'disabled'} 
        />
      </form>

      {loading && 
        <div className='Loading'>
          <p className='ubuntu-bold-italic'>Cargando...</p>
          <img src={buscar} alt="Cargando..." />
        </div>}
      {error && 
        <div className='Error'>
          <BiSolidError />
          <p>{error}</p>
        </div>}

      {storeDNI.length > 0 && (
        <ul className="Result">
          {storeDNI.map((person, index) => (
            <li key={index}>
              <h1>Resultados Para DNI: <span className='NumeroDNI'>{person.numero}</span></h1>
              <hr />
              <h2><span className='InfoDNI'>Nombre Completo:</span> {person.nombre_completo}</h2>
              <p><span className='InfoDNI'>Nombre:</span> {person.nombres}</p>
              <p><span className='InfoDNI'>Apellido:</span> {person.apellido_paterno} {person.apellido_materno}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;
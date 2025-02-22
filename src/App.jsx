import { useState } from 'react'
import './App.scss'
import { FaSearch } from "react-icons/fa";
import axios from 'axios';

function App() {
  const [dni, setDni] = useState('');
  const [value, setValue] = useState('');
  const [inputValid, setInputValid] = useState(false);
  const [storeDNI, setStoreDNI] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    const input = e.target.value;
    const regex = /^[0-9]*$/;

    if(input.length !== 8 || !regex.test(input)) {
      console.log('Ingrese un DNI valido');
      setValue(input);
      setInputValid(false);
    } else {
      console.log('DNI Aceptado');
      setValue(input);
      setDni(input);
      setInputValid(true);
    }

    console.log('Buscando...', {input});
  }

  const handleSearchClick = () => {
    const getDNI = dni;
    console.log('DNI Aceptado: Buscando...', {getDNI});

    const fetchDniData = async (dni) => {
        const url = "https://apiperu.dev/api/dni";
        const token = "93a787d6f0deb809e4d9530142cc774092b19a43bf7114c9372b3e6a362300df"; 
        try {
            const response = await axios.post(
                url,
                { dni: dni }, // Data payload
                {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            
            console.log("API Response:", response.data);
            localStorage.setItem('dni', JSON.stringify(response.data));
            setStoreDNI(response.data);
            setSearched(true);
        } catch (error) {
            console.error("API Error:", error);
        }
    };

  // Example Usage
  fetchDniData(getDNI);
  }

  return (
    <main className='MainApp'>
      <h1 className='Title'>Buscar Por DNI</h1>
      <p>Ingrese el DNI de la persona que desea buscar</p>
      <form className="Search">
        <input 
          type="number" 
          placeholder="Ingrese DNI" 
          max='8' 
          min='8' 
          value={value} 
          onChange={handleSearch} 
          className={inputValid ? 'bueno' : 'malo'}/>
        <FaSearch onClick={inputValid ? handleSearchClick : undefined} className={inputValid ? 'allow' : 'disabled'}/>
      </form>
      {searched && <div className="Result">
        <h1>Resultados Para <span>DNI: {storeDNI.data.numero}</span></h1>
        <hr />
        <h2>Nombre Completo: {storeDNI.data.nombre_completo}</h2>
        <p>Nombre: {storeDNI.data.nombres}</p>
        <p>Apellido: {storeDNI.data.apellido_paterno} {storeDNI.data.apellido_materno}</p>
      </div>}
    </main>
  )
}

export default App

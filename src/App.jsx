import { useState } from 'react'
import './App.scss'
import { FaSearch } from "react-icons/fa";

function App() {
  const [dni, setDni] = useState('');
  const [value, setValue] = useState('');
  const [inputValid, setInputValid] = useState(false);

  const handleSearch = (e) => {
    const input = e.target.value;

    if(input.length !== 8) {
      console.log('Ingrese un DNI valido');
      setValue(input);
      setInputValid(false);
    } else {
      console.log('DNI Aceptado');
      setValue(input);
      setDni(value);
      setInputValid(true);
    }

    console.log('Buscando...', {input});
  }

  const handleSearchClick = () => {
    setDni(value);
    console.log('Buscando...', {dni});
  }

  return (
    <main className='MainApp'>
      <h1>Buscar Por DNI</h1>
      <p>Ingrese el DNI de la persona que desea buscar</p>
      <div className="Search">
        <input 
          type="text" 
          placeholder="Ingrese DNI" 
          max='8' 
          min='8' 
          value={value} 
          onChange={handleSearch} 
          className={inputValid ? 'bueno' : 'malo'}/>
        <FaSearch onClick={handleSearchClick} className={inputValid ? 'allow' : 'disabled'}/>
      </div>
    </main>
  )
}

export default App

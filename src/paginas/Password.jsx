import { useState } from 'react'
import { Link } from "react-router-dom";
import clienteAxios from '../config/clienteAxios';
import Alerta from '../component/Alerta';

const Password = () => {

  const [email, setEmail] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async e => {
    e.preventDefault()

    if(email === ''){
      setAlerta({
        msg: 'Favor de revisar la dirección de correo',
        error: true
      })
      return
    }
    setAlerta({})
    try {
      const { data } = await clienteAxios.post(`/usuarios/recuperar`, {email})
      setAlerta({
        msg: data.msg,
        error: false
      })
    } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
    }

  }

  const {msg} = alerta

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>
        Recupera tu<span className='text-slate-700'> password.</span>
      </h1> 
      <form 
        className='my-10 bg-white shadow rounded-md p-10'
        onSubmit={handleSubmit}>
        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold'>
            Email
          </label>
          <input
            id='email'
            type='email'
            placeholder='Email'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        </div>
        <input
          type='submit'
          value='Recuperar password'
          className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded-md hover:cursor-pointer hover:bg-sky-900 transition-colors'
        />
      </form>
      {msg && <Alerta alerta={alerta} />}
      <nav className='lg:flex lg:justify-between'>
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/'
        >
          Iniciar sesión.
        </Link>
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/registrar'
        >
          Usuario nuevo. Regístrate.
        </Link>
      </nav>
    </>
  );
};

export default Password;
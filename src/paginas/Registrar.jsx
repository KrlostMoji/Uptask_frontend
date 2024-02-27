import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../component/Alerta";
import clienteAxios from "../config/clienteAxios";

const Registrar = () => {
  
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async e =>
  {
    e.preventDefault()

    if([nombre, email, password, password2].includes('')){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })

      return
    }

    if(password !== password2){
      setAlerta({
        msg: 'El password no coincide',
        error: true
      })
      return
    }

    if(password.length < 6){
      setAlerta({
        msg: 'El password debe contener 6 carácteres mínimo',
        error: true
      })
      return
    }

    setAlerta({})

    //Crear el usuario
    try 
    {
      const { data } = await clienteAxios.post(`/usuarios`, {nombre, email, password})
      
      setAlerta(
        {
          msg: data.msg,
          error: false
        }
      )

      setNombre('')
      setEmail('')
      setPassword('')
      setPassword2('')

    } catch (error) 
    {
      setAlerta(
        {
          msg:error.response.data.msg,
          error: true
        }
      )
      console.log(error.response.data.msg);
    }

  }

  const { msg } = alerta

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>
        Crea una cuenta y usa<span className='text-slate-700'> UpTask.</span>
      </h1> 
      <form 
        className='my-10 bg-white shadow rounded-md p-10'
        onSubmit={handleSubmit}
      >
        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold'>
            Nombre
          </label>
          <input
            id='nombre'
            type='nombre'
            placeholder='Nombre(s) Apellido(s)'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={nombre}
            onChange={e=>setNombre(e.target.value)}
          />
        </div>
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
        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold'>
            Password
          </label>
          <input
            id='password'
            type='password'
            placeholder='Password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
        </div>
        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold'>
            Confirmar password
          </label>
          <input
            id='password2'
            type='password'
            placeholder='Confirma tu password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={password2}
            onChange={e=>setPassword2(e.target.value)}
          />
        </div>
        <input
          type='submit'
          value='Registrar'
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
          to='/password'
        >
          Olvidé mi password.
        </Link>
      </nav>
    </>
  );
};

export default Registrar;
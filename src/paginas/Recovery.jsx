import {useState, useEffect} from 'react'
import { Link, useParams } from "react-router-dom";
import clienteAxios from '../config/clienteAxios';
import Alerta from '../component/Alerta';



const Recovery = () => {
  
  const [tokenValido, setTokenValido] = useState(false)
  const [alerta, setAlerta] = useState('')
  const [password, setPassword] = useState('')
  const [passwordModificado, setPasswordModificado] = useState(true)

  const params = useParams()
  const { token } = params

  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/recuperar/${token}`)
        setTokenValido(true)
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }

    comprobarToken()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    if(password.length < 6){
      setAlerta({
        msg: 'El password debe contener al menos 6 caracteres',
        error: true
      })
      return
    }

    try {
      const url = `/usuarios/recuperar/${token}`
      const { data } = await clienteAxios.post(url, {password})
      setAlerta({
        msg: data.msg,
        error: false
      })
      setPasswordModificado(true)
    } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
    }

  }

  const { msg } = alerta

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>
        Recupera tu acceso para administrar tus<span className='text-slate-700'> proyectos.</span>
      </h1> 
      {tokenValido && (
        <form 
          className='my-10 bg-white shadow rounded-md p-10'
          onSubmit={handleSubmit}
        >
          <div className='my-5'>
            <label className='uppercase text-gray-600 block text-xl font-bold'>
              Nuevo password
            </label>
            <input
              id='password'
              type='password'
              placeholder='Crea nuevo password'
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <input
            type='submit'
            value='Actualizar'
            className='bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded-md hover:cursor-pointer hover:bg-sky-900 transition-colors'
          />
        </form>
      )}
      {msg && <Alerta alerta={alerta} />}
      {passwordModificado && 
          <Link
            className='block text-center my-5 text-slate-500 uppercase text-sm'
            to='/'
          >
          Iniciar sesión.
        </Link>}
      {/* <nav className='lg:flex lg:justify-between'>
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/registrar'
        >
          Usuario nuevo. Regístrate.
        </Link>
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to='/password'
        >
          Olvidé mi password.
        </Link>
      </nav>  */}
    </>
  );
};

export default Recovery;
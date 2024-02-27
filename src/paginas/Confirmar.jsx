import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../component/Alerta";

const Confirmar = () => {

  //Obtener el ID de la URL
  const params = useParams()
  const {id} = params

  //Alerta
  const [alerta, setAlerta] = useState({})
  //Cuenta confirmadad para enlaces
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false)

  useEffect(()=>{
    const confirmarCuenta = async () => {
      try 
      {
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteAxios(url)
        setAlerta({
          msg: data.msg,
          error: false
        })
        setCuentaConfirmada(true)    
      } catch (error) {
        
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    confirmarCuenta()
    
  }, [])

  const {msg} = alerta

  return (
    <>
      <h1 className='text-sky-600 font-black text-6xl capitalize'>
        Comienza a crear tus proyectos con <span className='text-slate-700'> UpTask.</span>
      </h1> 
      <div className='mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white'>
        {msg && <Alerta alerta={alerta} />}
        {cuentaConfirmada && 
          <Link
            className='block text-center my-5 text-slate-500 uppercase text-sm'
            to='/'
          >
          Iniciar sesión.
        </Link>}
      </div>
    </>
  );
};

export default Confirmar;
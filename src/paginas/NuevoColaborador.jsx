import { useEffect } from "react";
import FormularioColaborador from "../component/FormularioColaborador";
import useProyectos from "../hooks/useProyectos";
import { useParams } from "react-router-dom";
import Alerta from "../component/Alerta";

const NuevoColaborador = () => {

  const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador, alerta } = useProyectos()
  const params = useParams()

  useEffect(() => {
    obtenerProyecto(params.id)
  }, [])

  // if (cargando) return 'Cargando...'

  return (
    <>
      <h1
        className='text-4xl font-black'
      >Añadir colaborador(a) a : {proyecto.nombre}</h1>
      <div
        className='mt-10 flex justify-center'
      >
        <FormularioColaborador />
      </div>
      {cargando ? <p className='text-center mt-20 text-2xl font-bold'>Cargando...</p> : colaborador?._id && (
        <div
        className='flex justify-center mt-10'
        >
          <div
            className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow'
          >
            <h2
              className='text-center mb-10 text-2xl font-bold'
            >Resultado</h2>
            <div
              className='flex items-center justify-evenly'
            >
              <p>{colaborador.nombre}</p>
              <p>{colaborador.email}</p>
              <button
                type='button'
                className='bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm'
                onClick={() => agregarColaborador({
                  email: colaborador.email
                })}
              >Agregar</button>
            </div>
          </div>
        </div>
      )}
      

      
    </>
  );
};

export default NuevoColaborador;
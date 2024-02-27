import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";
import ModalFormularioTarea from "../component/ModalFormularioTarea";
import ModalEliminarTarea from "../component/ModalEliminarTarea";
import ModalEliminarColaborador from "../component/ModalEliminarColaborador";
import Tarea from "../component/Tarea";
import Colaborador from "../component/Colaborador";
import io from 'socket.io-client'

let socket

const Proyecto = () => {

  const [modal, setModal] = useState(false)

  const { obtenerProyecto, proyecto, cargando, handleModalTarea, submitTareasProyecto, eliminarTareaProyecto, editarTareaProyecto, nuevoEstadoTarea} = useProyectos()
  const admin = useAdmin()
  const params = useParams()
  useEffect(() => {
    obtenerProyecto(params.id)
  }, [])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
    socket.emit('Abrir proyecto', params.id)
  }, [])

  useEffect(() => {
    socket.on('tarea agregada', (tareaNueva) => {
      if(tareaNueva.proyecto === proyecto._id){
        submitTareasProyecto(tareaNueva);
      }
    })

    socket.on('tarea eliminada', tareaEliminada =>{ 
      if(tareaEliminada.proyecto === proyecto._id){
        eliminarTareaProyecto(tareaEliminada)
      }
    })

    socket.on('tarea actualizada', tareaActualizada => {
      if(tareaActualizada.proyecto._id === proyecto._id){
        editarTareaProyecto(tareaActualizada)
      }
    })

    socket.on('estado cambiado', nuevoEstado =>{
      if(nuevoEstado.proyecto._id === proyecto._id){
        nuevoEstadoTarea(nuevoEstado)
      }
    })
  })

  const {nombre, tareas} = proyecto

  return (
      cargando ? 
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
      </span> 
      :
      <>
        <div className='flex justify-between'>
          <h1
            className='font-black text-4xl'
          >
            {nombre}
          </h1>
          {admin && (
            <div className='flex items-center gap-2 text-gray-500 hover:text-black'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
              </svg>
              <Link
                to={`/proyectos/editar/${params.id}`}
                className='uppercase font-bold'
              >Editar
              </Link>
            </div>
          )}
        </div>
        {admin && (
          <button
          onClick={handleModalTarea}
          type='button'
          className='text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center mt-5 flex gap-2 items-center'
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M6 3a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6ZM15.75 3a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3H18a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3h-2.25ZM6 12.75a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3v-2.25a3 3 0 0 0-3-3H6ZM17.625 13.5a.75.75 0 0 0-1.5 0v2.625H13.5a.75.75 0 0 0 0 1.5h2.625v2.625a.75.75 0 0 0 1.5 0v-2.625h2.625a.75.75 0 0 0 0-1.5h-2.625V13.5Z" />
            </svg>
            Nueva Tarea
          </button>
        )}
        
        <p
          className='font-bold text-xl mt-10'
        >Tareas:</p>
        <div
          className='flex justify-center'
        >
          <div
            className='w-full md:w-1/3 lg:w-1/40'
          >
          </div>
        </div>
        <div
          className='bg-white shadow mt-10 rounded-lg'
        >
          {tareas?.length ? 
          tareas?.map(tarea => (
            <Tarea 
              key={tarea._id}
              tarea={tarea}
            />
          )) : 
          <p
            className='text-center my-5 p-10'
          >
            Sin tareas
          </p>}
        </div>
        {admin && (
        <> 
          <div className='flex items-center justify-between mt-10 mb-20'>
            <p
              className='font-bold text-xl uppercase'
            >Colaboradores:</p>
            <Link
              to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
              className='font-bold text-gray-400 hover:text-black uppercase text-xl'
            >Agregar
            </Link>
          </div>
          <div
            className='bg-white shadow mt-10 rounded-lg'
          >
            {proyecto.colaboradores?.length ? 
            proyecto.colaboradores?.map(colaborador => (
              <Colaborador 
                key={colaborador._id}
                colaborador={colaborador}
              />
            )) : 
            <p
              className='text-center my-5 p-10'
            >
              No se han agregado colaboradores
            </p>}
          </div>
        </>
        )}
        
        <ModalFormularioTarea
          modal={modal}
          setModal={setModal}
        />
        <ModalEliminarTarea
          modal={modal}
          setModal={setModal}
        />
        <ModalEliminarColaborador
          modal={modal}
          setModal={setModal}
        />
      </>


    )
};

export default Proyecto;
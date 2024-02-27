import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";

const Tarea = ({tarea}) => {
  
  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos()

  const {descripcion, nombre, prioridad, fechaEntrega, _id, estado, proyecto} = tarea

  const admin = useAdmin()

  return (
    <div
      className='border-b p-5 flex justify-between items-center'
    >
      <div className='flex flex-col items-start'>
        <p
          className='mb-1 text-xl uppercase font-bold'
         >
          {nombre}
        </p>
        <p
          className='mb-1 text-lg text-gray-500 uppercase font-bold'
        >
          {descripcion}
        </p>
        <p
          className='mb-1 text-xl text-gray-600'
        >
          Prioridad: {prioridad}
        </p>        <p
          className='mb-1 text-lg text-blue-600'
        >
          Fecha de entrega: {formatearFecha(fechaEntrega)}
        </p>
        {estado && <p className='text-white text-xs bg-blue-500 rounded-lg uppercase p-1'>Completada por: {tarea.completado.nombre}</p>}
      </div>
      <div 
        className='flex flex-col lg:flex-row gap-2'
      >
      {admin && (
        <button
        className='bg-indigo-600 hover:bg-indigo-800 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
        onClick={() => handleModalEditarTarea(tarea)}
        >
          Editar
        </button>
      )}
      
        <button
          className={`${estado ? 'bg-sky-600' : 'bg-gray-600' } ${estado ? 'hover:bg-sky-800' : 'hover:bg-gray-800'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
          onClick={()=>completarTarea(_id, tarea)}
        >{estado ? 'Completa' : 'Incompleta'}
        </button>
      
      {admin && (
        <button
        className='bg-red-600 hover:bg-red-800 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg'
        onClick={() => handleModalEliminarTarea(tarea)}
        >
          Eliminar
        </button>
      )}
      
      </div>
      
    </div>
  );
};

export default Tarea;
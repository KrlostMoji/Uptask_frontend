import useProyectos from "../hooks/useProyectos";

const Colaborador = ({colaborador}) => {

  const { email, nombre } = colaborador

  const { handleModalEliminarColaborador } = useProyectos()

  return (
    <div className='border-b p-5 flex justify-between items-center'>
      <div>
        <p
          className='font-bold text-lg uppercase mb-2'
        >{nombre}</p>
        <p
          className='text-sm text-gray-500'
        >{email}</p>
      </div>
      <div>
        <button
          type='button'
          className='bg-red-600 px-4 py-3 text-white font-bold text-sm rounded-lg uppercase'
          onClick={()=>handleModalEliminarColaborador(colaborador)}
        >Eliminar</button>
      </div>
    </div>
  );
};

export default Colaborador;
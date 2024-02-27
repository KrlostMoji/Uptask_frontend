import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PreviewProyecto = ({proyecto}) => {

  const { auth } = useAuth()
  const { nombre, _id, cliente, creador } = proyecto

  return (
    <>
      <div className='pt-5 pb-1 ps-5 flex flex-col md:flex-row justify-between border-b'>
        <div className='flex-1'>
          <p
            className='text-md font-bold uppercase pe-2'
          >
            {nombre}
          </p>
          <p className='text-sm text-gray-500 uppercase pe-5'>
              {' '} {cliente}
          </p>
          <div className='pt-1 pb-5 flex'>
            {auth._id !== creador ?
            <p className='font-bold bg-cyan-600 text-sm rounded-lg p-1'>Colaborador</p> :
            <p className='font-bold bg-lime-600 text-sm rounded-lg p-1'>Creador</p>
            }
          </div>
        </div>
        <div>
        <Link 
          to={`${_id}`}
          className='text-gray-600 hover:text-gray-800 cursor:pointer uppercase font-bold pe-8'
        >
          Ver proyecto
        </Link>
        </div>  
      </div>
    </>
  );
};

export default PreviewProyecto;
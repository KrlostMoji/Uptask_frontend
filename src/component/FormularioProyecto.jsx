import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";

const FormularioProyecto = () => {
  const [id, setId] = useState(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [cliente, setCliente] = useState('')

  const params = useParams()

  const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos()

  useEffect(() => {
    if(params.id){
      setId(proyecto._id)
      setNombre(proyecto.nombre)
      setDescripcion(proyecto.descripcion)
      setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
      setCliente(proyecto.cliente)
    }else{
      setNombre('')
      setDescripcion('')
      setFechaEntrega('')
      setCliente('')
    }
  }, [params])

  const handleSubmit = async e => {
    e.preventDefault()

    if([nombre, descripcion, fechaEntrega, cliente].includes('')){
      mostrarAlerta({
        msg: 'Introduce la información de todos los campos',
        error: true
      })
      return
    }

      //pasar los datos al provider
      await submitProyecto({id, nombre, descripcion, fechaEntrega, cliente})

      setId(null)
      setNombre('')
      setDescripcion('')
      setFechaEntrega('')
      setCliente('')
  }

  const { msg } = alerta

  return (
    <form className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow-md'
      onSubmit={handleSubmit}
    >
      {msg && <Alerta alerta={alerta} />}
      <div className='mt-5'>
        <label
          className='text-gray-700 uppercase font-bold text-sm'
          htmlFor='nombre'
        >Título</label>
        <input
          id='nombre'
          type='text'
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          placeholder='Nombre del proyecto'
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
      </div>
      <div className='mt-5'>
        <label
          className='text-gray-700 uppercase font-bold text-sm'
          htmlFor='nombre'
        >Descripción</label>
        <input
          id='descripcion'
          type='text'
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          placeholder='Descripción breve del proyecto'
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
      </div>
      <div className='mt-5'>
        <label
          className='text-gray-700 uppercase font-bold text-sm'
          htmlFor='fecha-entrega'
        >Fecha Entrega</label>
        <input
          id='fecha-entrega'
          type='date'
          className='border w-full p-2 mt-2 rounded-md'
          value={fechaEntrega}
          onChange={e => setFechaEntrega(e.target.value)}
        />
      </div>
      <div className='mt-5'>
        <label
          className='text-gray-700 uppercase font-bold text-sm'
          htmlFor='cliente'
        >Cliente</label>
        <input
          id='cliente'
          type='text'
          className='border w-full p-2 mt-2 placeholder-gray-400 rounded-md'
          placeholder='Nombre de la empresa cliente'
          value={cliente}
          onChange={e => setCliente(e.target.value)}
        />
      </div>
      <input 
        type='submit'
        value={params.id ? 'Guardar cambios' : 'Crear proyecto'}
        className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded-md cursor-pointer hover:bg-sky-800 transition-colors mt-8'
      />
    </form>
  );
};

export default FormularioProyecto;
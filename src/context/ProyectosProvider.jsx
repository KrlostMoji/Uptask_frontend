import { useState, useEffect, createContext } from 'react'
import clienteAxios from '../config/clienteAxios';
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import io from 'socket.io-client'

let socket

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {

  const [proyectos, setProyectos] = useState([])
  const [proyecto, setProyecto] = useState({})
  const [alerta, setAlerta] = useState({})
  const [cargando, setCargando] = useState(false)
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
  const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
  const [tarea, setTarea] = useState({})
  const [colaborador, setColaborador] = useState({})
  const [buscador, setBuscador] = useState(false)

  const navigate = useNavigate()

  const {auth} = useAuth()

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`
          }
        }

        const { data } = await clienteAxios('/proyectos', config)
        setProyectos(data);
      } catch (error) {
        console.log(error);
      }
    }

    obtenerProyectos()

  }, [auth])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
  }, [])

  const mostrarAlerta = alerta => {
    setAlerta(alerta)

    setTimeout(() => {
      setAlerta({})
    }, 5000);

  }

  const submitProyecto = async proyecto => {
    if(proyecto.id){
      await editarProyecto(proyecto)
    }else{
      await crearProyecto(proyecto)
    }
  }

  const editarProyecto = async proyecto => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

      //Sincronizar el state
      const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
      setProyectos(proyectosActualizados)

      setAlerta({
        msg: 'Se han actualizado correctamente los datos proyecto',
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);

    } catch (error) {
      console.log(error);
    }
  }

  const crearProyecto = async proyecto => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        }
      }

      const { data } = await clienteAxios.post('/proyectos', proyecto, config)

      //Actualizar lista de proyectos, una vez creado un proyecto
      setProyectos([...proyectos, data])

      setAlerta({
        msg: 'Se ha creado correctamente el nuevo proyecto',
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);

    } catch (error) {
      console.log(error);
    }
  }

  const obtenerProyecto = async id => {
    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        }
      }
      
      const {data} = await clienteAxios(`/proyectos/${id}`, config)
      setProyecto(data)
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
      navigate('/proyectos')
      setTimeout(() => {
        setAlerta({})
      }, 3000);
    }
    setCargando(false)
  }

  const eliminarProyecto = async id => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.delete(`/proyectos/${id}`, config)

      //Sincronizar el state

      const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
      setProyectos(proyectosActualizados);
      
      setAlerta({
        msg: data.msg,
        error: false
      })

      setTimeout(() => {
        setAlerta({})
        navigate('/proyectos')
      }, 3000);

    } catch (error) {
      console.log(error);
    }
  }

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea)
    setTarea({})
  }

  const submitTarea = async tarea => {
    if (tarea?.id){
      await editarTarea(tarea)
    }else{
      await crearTarea(tarea)
    }
  
  }

  const crearTarea = async tarea => {
    try {

      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        }
      }

      if(auth._id === proyecto.creador){
        const {data} = await clienteAxios.post('/tareas', tarea, config)

        //Agregar la tarea al State de Proyecto
        // const proyectoActualizado = {...proyecto}
        // proyectoActualizado.tareas = [...proyecto.tareas, data]
        // setProyecto(proyectoActualizado)

        //Socket IO
        socket.emit('nueva tarea', data)
        setAlerta({})
        setModalFormularioTarea(false)


       }else{
         setAlerta({
           msg: 'No tienes los permisos para agregar una tarea',
           error: true
         })
       }
      


    } catch (error) {
      console.log(error);
    }


    }

    const editarTarea = async tarea => {
      try {
        const token = localStorage.getItem('token')
        if(!token) return
  
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`
          }
        }
        
        const {data} = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

        //Socket io
        socket.emit('actualizar tarea', data)

        setAlerta({})
        setModalFormularioTarea(false)  
        

      } catch (error) {
        console.log(error);
      }
    }

  const handleModalEditarTarea = tarea => {
    setModalFormularioTarea(true)
    setTarea(tarea)
  }

  const handleModalEliminarTarea = tarea => {
    setTarea(tarea)
    setModalEliminarTarea(!modalEliminarTarea)
  }

  const eliminarTarea = async () => {
    try {
      const token = localStorage.getItem('token')
        if(!token) return
  
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${token}`
          }
        }

        const {data} = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
        setAlerta({
          msg: data.msg,
          error: false
        })
        setModalEliminarTarea(false)

        //socket io
        socket.emit('eliminar tarea', tarea)

        setTarea({})
        setTimeout(() => {
          setAlerta({})
        }, 3000);

    } catch (error) {
      console.log(error);
    }
  }

  const submitColaborador = async email => {
    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
      setColaborador(data)

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })

      setTimeout(() => {
        setAlerta({})
      }, 3000);

    } finally {
      setCargando(false)
    }
  }

  const agregarColaborador = async email => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

      setAlerta({
        msg: data.msg,
        error: false
      })
      setColaborador({})

    } catch (error){
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })

    }
    setTimeout(() => {
      setAlerta({})
    }, 3000);
  }

  const handleModalEliminarColaborador = colaborador => {
    setModalEliminarColaborador(!modalEliminarColaborador)
    setColaborador(colaborador)
  }

  const eliminarColaborador = async () => {
    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        }
      }

      const {data} = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

      const proyectoActualizado = {...proyecto}
      proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

      setProyecto(proyectoActualizado)

      setAlerta({
        msg: data.msg,
        error: false
      })
      setColaborador({})
      setModalEliminarColaborador(false)


      setTimeout(() => {
        setAlerta({})
      }, 3000);

    } catch (error) {
        console.log(error.response);
    }
  }

  const completarTarea = async (id, tarea) => {

    try {
      const token = localStorage.getItem('token')
      if(!token) return

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${token}`
        }
      }
      
      const { data } = await clienteAxios.post(`/tareas/estado/${id}`, tarea, config)
      // const proyectoActualizado = {...proyecto}
      // proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === data._id ? data: tareaState)
      // setProyecto(proyectoActualizado)

      //socket io
      socket.emit('cambiar estado', data)


      setTarea({})
      setAlerta({})

    } catch (error) {
      console.log(error);
    }
  
  }

  const handleBuscador = () => {
    setBuscador(!buscador)
  }
  
  //Socket Io
  const submitTareasProyecto = tarea => {
    //Agregar la tarea al State de Proyecto
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
    setProyecto(proyectoActualizado)
  }

  const eliminarTareaProyecto = tarea => {
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
    setProyecto(proyectoActualizado)
  }

  const editarTareaProyecto = tarea => {
    //Actualizar la tarea en el State de Proyecto
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
    setProyecto(proyectoActualizado)
  }

  const nuevoEstadoTarea = tarea => {
    const proyectoActualizado = {...proyecto}
    proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
    setProyecto(proyectoActualizado)
  }

  const cerrarSesionProyectos = () => {
    setProyectos([])
    setProyecto({})
    setAlerta({})
  }

  return(
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        handleBuscador,
        buscador,
        submitTareasProyecto,
        eliminarTareaProyecto,
        editarTareaProyecto,
        nuevoEstadoTarea,
        cerrarSesionProyectos
      }}
    >
      {children}
    </ProyectosContext.Provider>
  )
}

export {
  ProyectosProvider
}

export default ProyectosContext;
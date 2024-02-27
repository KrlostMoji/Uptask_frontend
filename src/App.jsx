import { BrowserRouter, Routes, Route } from 'react-router-dom'

import AuthLayout from './layouts/AuthLayout'
import Login from './paginas/Login'
import Registrar from './paginas/Registrar'
import Password from './paginas/Password'
import Recovery from './paginas/Recovery'
import Confirmar from './paginas/Confirmar'

import RutaProtegida from './layouts/RutaProtegida'
import Proyectos from './paginas/Proyectos'
import NuevoProyecto from './paginas/NuevoProyecto'
import Proyecto from './paginas/Proyecto'
import EditarProyecto from './paginas/EditarProyecto'
import NuevoColaborador from './paginas/NuevoColaborador'

import { AuthProvider } from './context/AuthProvider'
import { ProyectosProvider } from './context/ProyectosProvider'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <ProyectosProvider>
          <Routes>
            <Route path='/' element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path='registrar' element={<Registrar />} />
              <Route path='password' element={<Password />} />
              <Route path='password/:token' element={<Recovery />} />
              <Route path='confirmar/:id' element={<Confirmar />} />
            </Route>
            <Route path='/proyectos' element={<RutaProtegida />}>
              <Route index element={<Proyectos />} />
              <Route path='crear-proyecto' element={<NuevoProyecto />} />
              <Route path='nuevo-colaborador/:id' element={<NuevoColaborador />} />
              <Route path=':id' element={<Proyecto />} />
              <Route path='editar/:id' element={<EditarProyecto />} />
            </Route>
          </Routes>
        </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

import FormularioProyecto from "../component/FormularioProyecto";

const Proyectos = () => {
  return (
    <>
      <h1 
        className='text-4xl font-black'
      >Crear proyecto</h1>
      <div 
        className='mt-10 flex justify-center'
      >
        <FormularioProyecto />
      </div>
    </>
  );
};

export default Proyectos;
const Alerta = ({alerta}) => {
  return (
    <div className={`${alerta.error ? 'from-red-400 to-red-600' : 'from-sky-400 to-sky-600'} bg-gradient-to-br text-center p-3 rounded-md text-white font-bold text-sm uppercase my-10`}>
      {alerta.msg}
    </div>
  );
};

export default Alerta;
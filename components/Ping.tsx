const Ping = () => {
  return (
    <div className="relative flex items-center justify-center h-4 w-4">
      {/* Pulsing background */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
      
      {/* Stable center dot */}
      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
    </div>
  );
};

export default Ping;

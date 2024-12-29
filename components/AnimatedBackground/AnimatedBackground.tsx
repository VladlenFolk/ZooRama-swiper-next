const AnimatedBackground = () => {
    const cubes = Array.from({ length: 6 }, (_, index) => index + 1);
  
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center">
        <h1 className="gradient-text text-6xl font-bold antialiased">Loading</h1>
        <div className="hero">
          {cubes.map((_, index) => (
            <div key={index} className="cube"></div>
          ))}
        </div>
      </div>
    );
  };
  
  export default AnimatedBackground;
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
 
export const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);
 
  const particlesLoaded = useCallback(async (container) => {
    console.log("Particles loaded", container);
  }, []);
 
  return (
    <div className="particles-container">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              // value: "#0a0e27",
              value: "transparent"
            },
          },
          fpsLimit: 30,
          interactivity: {
            events: {
              onClick: {
                enable: false,
                mode: "push",
              },
              onHover: {
                enable: false,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "triangle",
            },
            size: {
              value: { min: 5, max: 10 },
            },
          },
          detectRetina: true,
        }}
      />
      
      {/* Your content goes here */}
      <div className="content">
        {/* <h1>Welcome to tsParticles</h1>
        <p>A stunning particle animation background for React</p> */}
      </div>
 
      <style jsx>{`
        .particles-container {
          position: absolute;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          z-index: 0;
        }
 
        #tsparticles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }
 
        .content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
        }
 
        .content h1 {
          font-family: 'Space Grotesk', 'Helvetica Neue', sans-serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 1rem 0;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          animation: fadeInUp 1s ease-out;
        }
 
        .content p {
          font-family: 'Inter', sans-serif;
          font-size: clamp(1rem, 3vw, 1.5rem);
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          animation: fadeInUp 1s ease-out 0.2s backwards;
        }
 
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
 
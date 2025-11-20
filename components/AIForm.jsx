"use client";

import { useForm, FormProvider } from "react-hook-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoHardwareChipSharp } from "react-icons/io5";
import MatrixPrompt from "./prompt/MatrixPrompt";

export default function AIForm() {
  const onError = (errors, e) => console.log(errors, e)
  const [position, setPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackground, setShowBackground] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const methods = useForm();
  const { handleSubmit } = methods;
  const [error, setError] = useState("");
  // isPromptFocused now handled inside MatrixPrompt

  const onSubmitIA = async (data) => {
    setPosition(1);
    animateMarcoInformativo();
  }

  const animateMarcoInformativo = () => {
    const marco = document.getElementById("marco-informativo");
    if (marco) {
      // Restaurar z-index y pointer events al mostrar
      marco.style.zIndex = "10";
      marco.style.pointerEvents = "auto";
      marco.style.visibility = "visible";
      
      marco.animate([
        { bottom: "-100%", opacity: "0" },
        { bottom: "25%", opacity: "1" },
      ], {
        duration: 300,
        iterations: 1,
        delay: 200,
        easing: "ease-out",
        fill: "forwards"
      });
    }
  }

  const transitionToNewContent = (newPosition) => {
    const marco = document.getElementById("marco-informativo");
    if (marco && position > 0) {
      setIsTransitioning(true);
      
      // Primero ocultar hacia abajo
      const hideAnimation = marco.animate([
        { bottom: "25%", opacity: "1" },
        { bottom: "-100%", opacity: "0" },
      ], {
        duration: 250,
        easing: "ease-in",
        fill: "forwards"
      });
      
      // Cuando termine de ocultarse, cambiar contenido y mostrar
      hideAnimation.onfinish = () => {
        setPosition(newPosition);
        setIsTransitioning(false);
        
        // Pequeño delay para asegurar que el contenido se actualice
        setTimeout(() => {
          marco.animate([
            { bottom: "-100%", opacity: "0" },
            { bottom: "25%", opacity: "1" },
          ], {
            duration: 300,
            easing: "ease-out",
            fill: "forwards"
          });
        }, 50);
      };
    } else {
      // Si viene desde HOME, animación normal
      setPosition(newPosition);
    }
  }

  const hideMarcoInformativo = () => {
    const marco = document.getElementById("marco-informativo");
    if (marco) {
      const animation = marco.animate([
        { bottom: "25%", opacity: "1" },
        { bottom: "-100%", opacity: "0" },
      ], {
        duration: 300,
        iterations: 1,
        easing: "ease-in",
        fill: "forwards"
      });
      
      // Al finalizar la animación, cambiar z-index para no interferir
      animation.onfinish = () => {
        marco.style.zIndex = "-1";
        marco.style.pointerEvents = "none";
        marco.style.visibility = "hidden";
      };
    }
  }

  // Secuencia de carga inicial
  useEffect(() => {
    const loadingSequence = async () => {
      // Paso 1: Mostrar loader por 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
      
      // Paso 2: Fade in del fondo
      setShowBackground(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Paso 3: Animación del marco-prompt desde arriba
      setShowPrompt(true);
    };
    
    loadingSequence();
  }, []);

  // Animar cuando cambie la posición
  useEffect(() => {
    if (position > 0 && !isTransitioning) {
      animateMarcoInformativo();
    } else if (position === 0) {
      hideMarcoInformativo();
    }
  }, [position, isTransitioning])

  const handleBackMenu = () => {
    if (position === 0) return; // No hacer nada si está en el menú principal
    setPosition(0); // Volver al menú principal
  }

  const handleNextMenu = () => {
    // Ciclo: 1 -> 2 -> 3 -> 1
    const newPosition = position >= 3 ? 1 : position + 1;
    transitionToNewContent(newPosition);
  }

  const handlePrevMenu = () => {
    // Ciclo hacia atrás: 1 -> 3 -> 2 -> 1  
    const newPosition = position <= 1 ? 3 : position - 1;
    transitionToNewContent(newPosition);
  }

  const isMobile = () => {
    return typeof window !== 'undefined' && window.innerWidth < 640;
  }

const getBackgroundClasses = () => {
  const opacity = position > 0 ? "opacity-30" : "opacity-100";
  const baseClasses = `absolute w-full h-screen bg-no-repeat transition-all duration-700 ease-out ${opacity}`;
  const isMobileDevice = isMobile();
  
  if (isMobileDevice) {
    return `${baseClasses} bg-[url('/backgroud-yga.png')] bg-[length:auto_160%]`;
  } else {
    return `${baseClasses} bg-[url('/backgroud-yga.png')] bg-[length:200%]`;
  }
};

const getBackgroundPosition = () => {
  const isMobileDevice = isMobile();
  
  if (isMobileDevice) {
    switch (position) {
      case 1: return '50% 15%';
      case 2: return '50% 50%';
      case 3: return '50% 99%';
      default: return '50% 15%';
    }
  } else {
    switch (position) {
      case 1: return '0% 100%';
      case 2: return '50% 100%';
      case 3: return '99% 100%';
      default: return '50% 19%';
    }
  }
};

  const getConectorsClasses = () => {
    const opacity = position > 0 ? "opacity-20" : "opacity-100";
    const baseClasses = `absolute w-full h-screen bg-no-repeat transition-all duration-700 ease-out ${opacity}`;

    switch (position) {
      case 1:
        return `${baseClasses} bg-[url('/conectores-yga.svg')] bg-[length:200%] bg-[position:1%_100%]`;
      case 2:
        return `${baseClasses} bg-[url('/conectores-yga.svg')] bg-[length:200%] bg-[position:50%_100%]`;
      case 3:
        return `${baseClasses} bg-[url('/conectores-yga.svg')] bg-[length:200%] bg-[position:99%_100%]`;
      default:
        return `${baseClasses} bg-[url('/conectores-yga.svg')] bg-[length:200%] bg-[position:50%_15%]`;
    }
  }

  return (
    <main className="absolute w-full h-screen top-0 left-0 overflow-hidden">
      {/* Loader */}
      {isLoading && (
        <div className="absolute w-full h-screen bg-black flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="font-michroma neon text-lg">INICIANDO SISTEMA...</div>
          </div>
        </div>
      )}
      
      {/* Background con fade-in */}
      <div className={getBackgroundClasses()} style={{ backgroundPosition: getBackgroundPosition() }}>
        <div className={getConectorsClasses()}></div>
      </div>
      
      {/* Overlay negro que se desvanece */}
      <div className={`absolute w-full h-screen bg-black transition-opacity duration-800 ${showBackground ? 'opacity-0 pointer-events-none' : 'opacity-100'} z-10`}></div>
      
      <div id="marco-prompt" className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${!showPrompt ? 'transform -translate-y-full opacity-0' : position == 0 ? 'absolute w-full text-center transform translate-y-[2%] opacity-100' : 'transform translate-y-[-100%] opacity-100'}`}>
        <div className="bg-black/50 py-4 px-6 rounded-lg">
          <div className="font-michroma neon text-2xl md:text-4xl text-center sm:mb-6">¿Qué buscas?</div>
          <div className="flex justify-center items-center font-michroma neon text-sm sm:text-lg md:text-xl font-medium leading-6 text-gray-400 px-4">
            <span className="text-center tracking-wide max-w-2xl">Es una pregunta <br />¿Cuál es esa pregunta?. <br />Escríbela y presiona el chip</span>
          </div>
        </div>
        <FormProvider {...methods}>
          <form className="mt-0 sm:mt-0 w-full mx-auto px-4" onSubmit={handleSubmit(onSubmitIA, onError)}>
            <div className="space-y-4 sm:space-y-8">
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <MatrixPrompt error={error} setError={setError} />
                </div>
              </div>
              {/* El error ahora aparece dentro del textarea como tercera línea */}
              <button type="submit" id="btn-hidden-send"/>              
            </div>
          </form>
        </FormProvider>
      </div>

      <div className={`w-full absolute ml-1`} style={{ bottom: isMobile() ? '14%' : '5%', height: isMobile() ? '358px' : '240px'  }}>
        <div className="w-full flex flex-col items-center" style={{ height: isMobile() ? '358px' : '240px'  }}>
          <button
            className={`btn ${position === 0 ? 'block' : 'hidden'}`}
            onClick={() => document.getElementById('btn-hidden-send').click()}
          />
        </div>        
      </div>

      <div id="marco-informativo" className={`absolute w-full marco-informativo py-8 sm:py-10 md:py-12 lg:py-16 px-12 sm:px-16 md:px-20 lg:px-32 -bottom-full transition-opacity duration-300 ${position === 0 ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible pointer-events-auto'}`}>
        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-6 lg:gap-8 items-center pl-16 pr-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] overflow-hidden rounded-lg shadow-2xl">
              <Image width={400} height={400} className="w-full h-full object-cover" src={`${position == 0 ? '/interference.gif' : `/brand_${position}.png`}`} alt="cuadro_01" />
            </div>
          </div>
          <div className="w-full md:w-2/3 text-white px-6 md:px-8 lg:px-12">
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 font-semibold leading-tight">{["", "WOMEX", "SG-MetroRuma", "NVIEW"][position]}</p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 leading-relaxed">{["", "Gestione su negocio de comercio nacional/internacional. WOMEX"
              + " consolida toda la información desde su acuerdo (contrato), pasando por el transporte, estadías"
              + ", pagos y otros. Sea notificado en tiempo real de información crítica para su negocio.",
              "Potencie al máximo sus sistemas de trato de madera, con gestión de producción y"
              + " reporte en pantalla/celular.", "Compare entre periodo el nivel de ventas, gestionando cada"
              + " evento de su negocio. NView es una herramienta perfecta en la determinación de campañas"
              + " exitosas/fallidas para toma de decisiones basadas en estrategias de mercado"][position]}</p>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-300">Experimente la reportabilidad en tiempo real y ahorre decidiendo mejor
              respecto a sus clientes y productos críticos.</p>
          </div>
        </div>

        {/* Indicadores de posición */}
        {position > 0 && (
          <div className="absolute -bottom-4 sm:-bottom-5 md:-bottom-6 lg:-bottom-7 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-1 sm:space-x-2">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${position === index
                    ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
                    : 'bg-gray-600 hover:bg-gray-400'
                    }`}
                  onClick={() => transitionToNewContent(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Botón Inicio responsive */}
      <div className={`absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-2 sm:left-4 md:left-6 lg:left-10 cursor-pointer z-20 ${position == 0 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="neon text-4xl sm:text-5xl md:text-6xl lg:text-8xl ml-1 sm:ml-2" onClick={handleBackMenu}>⌂</div>
        <span className="relative neon text-xs sm:text-sm ml-2 sm:ml-4 md:ml-6 -top-1 sm:-top-2 md:-top-3">Inicio</span>
      </div>

      {/* Navegación lateral izquierda responsive */}
      {position > 1 && (
        <div className="absolute top-1/2 left-1 sm:left-2 md:left-4 cursor-pointer transform -translate-y-1/2 z-20">
          <div className="neon text-3xl sm:text-4xl md:text-5xl lg:text-6xl" onClick={handlePrevMenu}>‹</div>
        </div>
      )}

      {/* Navegación lateral derecha responsive */}
      {position > 0 && position < 3 && (
        <div className="absolute top-1/2 right-1 sm:right-2 md:right-4 cursor-pointer transform -translate-y-1/2 z-20">
          <div className="neon text-3xl sm:text-4xl md:text-5xl lg:text-6xl" onClick={handleNextMenu}>›</div>
        </div>
      )}

      {/* Botón COTIZAR responsive */}
      <div className={`absolute bottom-6 sm:bottom-8 md:bottom-12 lg:bottom-14 cursor-pointer left-1/2 transform -translate-x-1/2 z-20 ${position == 0 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="button-container">
          <button className="btn-primary btn-cotizar text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4">COTIZAR</button>
        </div>
      </div>

      <style jsx>{`
        @keyframes matrix-glitch {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}
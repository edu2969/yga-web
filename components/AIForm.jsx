"use client";

import { useForm, FormProvider } from "react-hook-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoHardwareChipSharp } from "react-icons/io5";
import MatrixPrompt from "./prompt/MatrixPrompt";
import WhoWeAre from "./WhoWeAre";

export default function AIForm() {
  const onError = (errors, e) => console.log(errors, e)
  const [position, setPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackground, setShowBackground] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [quickPromptSelected, setQuickPromptSelected] = useState(false);

  const methods = useForm();
  const { handleSubmit } = methods;
  const [error, setError] = useState("");
  // isPromptFocused now handled inside MatrixPrompt

  const onSubmitIA = async (data) => {
    setPosition(1);
    if (!quickPromptSelected) animateMarcoInformativo();
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
    if (position > 0 && !isTransitioning && !quickPromptSelected) {
      animateMarcoInformativo();
    } else if (position === 0) {
      hideMarcoInformativo();
    }
  }, [position, isTransitioning, quickPromptSelected])

  const handleBackMenu = () => {
    if (position === 0) return; // No hacer nada si está en el menú principal
    setQuickPromptSelected(false);
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

  const getBackgroundPositionClasses = () => {
    switch (position) {
      case 1:
        return "bg-[position:0%_100%] max-sm:bg-[position:50%_15%]";
      case 2:
        return "bg-[position:50%_100%] max-sm:bg-[position:50%_50%]";
      case 3:
        return "bg-[position:99%_100%] max-sm:bg-[position:50%_99%]";
      default:
        return "bg-[position:50%_19%] max-sm:bg-[position:50%_15%]";
    }
  };

  const getBackgroundClasses = () => {
    const opacity = position > 0 ? "opacity-30" : "opacity-100";
    const baseClasses = `ai-form-background absolute w-full h-screen bg-no-repeat transition-all duration-700 ease-out ${opacity} bg-[url('/backgroud-yga.png')]`;

    return `${baseClasses} ${getBackgroundPositionClasses()}`;
  };

  const getConectorsClasses = () => {
    const opacity = position > 0 ? "opacity-20" : "opacity-100";
    const baseClasses = `ai-form-background absolute w-full h-screen bg-no-repeat transition-all duration-700 ease-out ${opacity} bg-[url('/conectores-yga.svg')]`;

    return `${baseClasses} ${getBackgroundPositionClasses()}`;
  }

  const brandIndex = ["", "1", "2", "4"];

  return (
    <main className="ai-form-scene absolute w-full h-screen top-0 left-0 overflow-hidden">
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
      <div className={getBackgroundClasses()}>
        <div className={getConectorsClasses()}></div>
      </div>
      
      {/* Overlay negro que se desvanece */}
      <div className={`absolute w-full h-screen bg-black transition-opacity duration-800 ${showBackground ? 'opacity-0 pointer-events-none' : 'opacity-100'} z-10`}></div>
      
      <div id="marco-prompt" className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${!showPrompt ? 'transform -translate-y-full opacity-0' : position == 0 ? 'absolute w-full text-center transform translate-y-[2%] opacity-100' : 'transform translate-y-[-100%] opacity-100'}`}>
        <div className="bg-black/50 py-3 px-3 sm:py-4 sm:px-6 rounded-lg">
          <div className="font-michroma neon text-xl sm:text-2xl md:text-4xl text-center sm:mb-6">¿Qué buscas?</div>
          <div className="flex justify-center items-center font-michroma neon text-xs sm:text-sm md:text-xl font-medium leading-5 sm:leading-6 text-gray-400 px-2 sm:px-4">
            <span className="text-center tracking-wide max-w-2xl">Es una pregunta <br />¿Cuál es esa pregunta?. <br />Escríbela y presiona el chip</span>
          </div>
        </div>
        <FormProvider {...methods}>
          <form className="mt-0 sm:mt-0 w-full mx-auto px-2 sm:px-4" onSubmit={handleSubmit(onSubmitIA, onError)}>
            <div className="space-y-4 sm:space-y-8">
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <MatrixPrompt
                    error={error}
                    setError={setError}
                    onQuickPromptSelected={() => setQuickPromptSelected(true)}
                  />
                </div>
              </div>
              {/* El error ahora aparece dentro del textarea como tercera línea */}
              <button type="submit" id="btn-hidden-send"/>              
            </div>
          </form>
        </FormProvider>
      </div>

      <button
        className={`btn ${position === 0 ? 'block' : 'hidden'}`}
        onClick={() => document.getElementById('btn-hidden-send').click()}
        aria-label="Enviar pregunta"
      />

      <div id="marco-informativo" className={`absolute w-full marco-informativo py-10 sm:py-12 md:py-12 lg:py-16 px-8 sm:px-10 md:px-20 lg:px-32 -bottom-full transition-opacity duration-300 ${position === 0 ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible pointer-events-auto'}`}>
        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-6 lg:gap-8 items-center px-4 md:pl-16 md:pr-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] overflow-hidden rounded-lg shadow-2xl">
              <Image width={400} height={400} className="w-full h-full object-cover" src={`${position == 0 ? '/interference.gif' : `/brand_${brandIndex[position]}.png`}`} alt="cuadro_01" />
            </div>
            {position > 0 && quickPromptSelected && (
              <div className="absolute bottom-4 left-1/2 z-10 w-full -translate-x-1/2">
                <WhoWeAre />
              </div>
            )}
          </div>
          <div className="w-full md:w-2/3 text-white px-10 md:px-12 lg:px-14">
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 font-semibold leading-tight">{["", "WOMEX", "SG MetroRuma", "PartySuite"][position]}</p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 leading-relaxed">{["", "Gestione su negocio de comercio nacional/internacional. WOMEX"
              + " consolida toda la información desde su acuerdo (contrato), pasando por el transporte, estadías"
              + ", pagos y otros. Sea notificado en tiempo real de información crítica para su negocio.",
              "Potencie al máximo sus sistemas de trato de madera, con gestión de producción y"
              + " reporte en pantalla/celular.", "Gestione todo respecto a sus listas de invitados. En puerta,"
              + " y con su rut u otro documento, revisa la asistencia de forma rápida, pudiendo chequear además,"
              + " que tan efectivo es tu equipo en sus inscripciones."][position]}</p>
            <p className="text-sm sm:text-center md:text-lg lg:text-xl leading-relaxed text-gray-300">
              {["", "Experimente la reportabilidad en tiempo real y ahorre decidiendo mejor" + 
                " respecto a sus clientes y productos críticos.", 
                "Todo el panel de tu negocio, en tu celular o computadora.", 
                "Con ésto, las listas ordenadas, registradas y claras."][position]}</p>
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
      <div className={`absolute bottom-6 sm:bottom-8 md:bottom-12 lg:bottom-14 cursor-pointer left-1/2 transform -translate-x-1/2 z-20 ${position == 0 || quickPromptSelected ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
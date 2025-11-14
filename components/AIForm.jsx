"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoHardwareChipSharp } from "react-icons/io5"

export default function AIForm() {
  const onError = (errors, e) => console.log(errors, e)
  const [position, setPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    register,
    formState: {
      errors
    },
    handleSubmit,
  } = useForm();
  const [error, setError] = useState("");

  const onSubmitIA = async (data) => {
    setError(false);
    setPosition(1);
    animateMarcoInformativo();
  }

  const animateMarcoInformativo = () => {
    const marco = document.getElementById("marco-informativo");
    if (marco) {
      // Restaurar z-index y pointer events al mostrar
      marco.style.zIndex = "10";
      marco.style.pointerEvents = "auto";
      
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
      };
    }
  }

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

  // Generar clases dinámicas para el background
  const getBackgroundClasses = () => {
    const opacity = position > 0 ? "opacity-30" : "opacity-100";
    const baseClasses = `absolute w-full h-screen bg-no-repeat transition-all duration-700 ease-out ${opacity}`;

    switch (position) {
      case 1:
        return `${baseClasses} bg-[url('/backgroud-yga.png')] bg-[length:200%] bg-[position:1%_100%]`;
      case 2:
        return `${baseClasses} bg-[url('/backgroud-yga.png')] bg-[length:200%] bg-[position:50%_100%]`;
      case 3:
        return `${baseClasses} bg-[url('/backgroud-yga.png')] bg-[length:200%] bg-[position:99%_100%]`;
      default:
        return `${baseClasses} bg-[url('/backgroud-yga.png')] bg-[length:200%] bg-[position:50%_15%]`;
    }
  }

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
        return `${baseClasses} bg-[url('/conectores-yga.jpg')] bg-[length:200%] bg-[position:50%_15%]`;
    }
  }

  return (
    <main className="absolute w-full h-screen top-0 left-0 overflow-hidden">
      <div className={getBackgroundClasses()}>
        <div className={getConectorsClasses()}></div>
      </div>
      <div id="marco-prompt" className={`flex flex-col items-center justify-center transition-all duration-500 ease-out ${position == 0 ? 'absolute w-full text-center transform translate-y-[2%]' : 'transform translate-y-[-100%]'}`}>
        <div className="font-michroma neon text-4xl text-center my-4 sm:mb-6">¿QUÉ BUSCAS?</div>
        <div className="flex justify-center items-center font-michroma neon sm:text-lg md:text-xl font-medium leading-6 text-gray-400 px-4">
          <span className="text-center tracking-wide max-w-2xl">Estás aquí por una pregunta <br />¿Cuál es esa pregunta?. <br />Escríbela y presiona el chip </span>
        </div>
        <form className="mt-4 sm:mt-8 w-full mx-auto px-4" onSubmit={handleSubmit(onSubmitIA, onError)}>
          <div className="space-y-4 sm:space-y-8">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                {errors.prompt && <p className="text-red-500 text-center mb-4 text-sm sm:text-base">Descripción requerida</p>}
                <div className="matrix-terminal-container mx-4 sm:mx-8 md:mx-12">
                  <div className="matrix-terminal-frame">
                    <div className="terminal-header">
                      <div className="terminal-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                      </div>
                      <span className="terminal-title">NEURAL_INTERFACE_v2.1</span>
                    </div>
                    <textarea {...register("prompt", { required: true })}
                      id="prompt" name="prompt" type="text" required
                      rows={3}
                      placeholder="> Toc Toc..._"
                      className="matrix-textarea" />
                  </div>
                </div>
              </div>
            </div>
            {error && <div className="text-center"><span className="text-red-500 text-sm sm:text-base">{error}</span></div>}
            <div className="flex justify-center">
              <button type="submit" id="btnSend" className={`btn ${position === 0 ? 'block' : 'hidden'}`} />
            </div>
          </div>
        </form>
      </div>





      <div id="marco-informativo" className="absolute block w-full marco-informativo py-8 sm:py-10 md:py-12 lg:py-16 px-12 sm:px-16 md:px-20 lg:px-32 -bottom-full">
        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-6 lg:gap-8 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] overflow-hidden rounded-lg shadow-2xl">
              <Image width={400} height={400} className="w-full h-full object-cover" src="/brand.png" alt="cuadro_01" />
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
    </main>
  );
}
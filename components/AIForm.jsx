"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoHardwareChipSharp } from "react-icons/io5"

export default function AIForm() {
  const onError = (errors, e) => console.log(errors, e)
  const [position, setPosition] = useState(0);

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
      marco.animate([
        { top: "-100%" },
        { top: "0px" },
      ], {
        duration: 250,
        iterations: 1,
        delay: 550,
        easing: "ease-out",
      });
    }
  }

  // Animar cuando cambie la posición (excepto al volver al menú)
  useEffect(() => {
    if (position > 0) {
      animateMarcoInformativo();
    }
  }, [position])

  const handleBackMenu = () => {
    if (position === 0) return; // No hacer nada si está en el menú principal
    setPosition(0); // Volver al menú principal
  }

  const handleNextMenu = () => {
    // Ciclo: 1 -> 2 -> 3 -> 1
    if (position >= 3) {
      setPosition(1);
    } else {
      setPosition(position + 1);
    }
  }

  const handlePrevMenu = () => {
    // Ciclo hacia atrás: 1 -> 3 -> 2 -> 1  
    if (position <= 1) {
      setPosition(3);
    } else {
      setPosition(position - 1);
    }
  }

  // Generar clases dinámicas para el background
  const getBackgroundClasses = () => {
    const baseClasses = "absolute w-full h-screen bg-no-repeat transition-all duration-700 ease-out";

    switch (position) {
      case 1:
        return `${baseClasses} bg-[url('/backgroud-yga.jpg')] bg-[length:200%] bg-[position:50%_30%]`;
      case 2:
        return `${baseClasses} bg-[url('/backgroud-yga.jpg')] bg-[length:200%] bg-[position:20%_50%]`;
      case 3:
        return `${baseClasses} bg-[url('/backgroud-yga.jpg')] bg-[length:200%] bg-[position:80%_70%]`;
      default:
        return `${baseClasses} bg-[url('/backgroud-yga.jpg')] bg-[length:200%] bg-[position:50%_15%]`;
    }
  }

    const getConectorsClasses = () => {
    const baseClasses = "absolute w-full h-screen bg-no-repeat transition-all duration-700 ease-out";

    switch (position) {
      case 1:
        return `${baseClasses} bg-[url('/conectores-yga.svg')] bg-[length:200%] bg-[position:-0px_center]`;
      case 2:
        return `${baseClasses} bg-[url('/conectores-yga.svg')] bg-[length:200%] bg-[position:20%_50%]`;
      case 3:
        return `${baseClasses} bg-[url('/conectores-yga.svg')] bg-[length:200%] bg-[position:80%_70%]`;
      default:
        return `${baseClasses} bg-[url('/conectores-yga.jpg')] bg-[length:200%] bg-[position:50%_25%]`;
    }
  }

  return (
    <main className="absolute w-full h-screen top-0 left-0 overflow-hidden">
      <div className={getBackgroundClasses()}>
        <div className={`${getConectorsClasses()} absolute w-full h-screen bg-no-repeat bg-cover transition-all duration-500 ease-out`}></div>

        <div id="marco-prompt" className={`flex flex-col items-center justify-center transition-all duration-500 ease-out ${position == 0 ? 'absolute w-full text-center transform translate-y-[2%]' : 'transform translate-y-[-22%]'}`}>
          <div className="font-michroma neon text-4xl text-center my-4 sm:mb-6">¿QUÉ BUSCAS?</div>
          <div className="flex justify-center items-center font-michroma neon sm:text-lg md:text-xl font-medium leading-6 text-gray-400 px-4">
            <span className="text-center tracking-wide max-w-2xl">Estás aquí por una pregunta <br/>¿Cuál es esa pregunta?. <br/>Escríbela y presiona el chip </span>
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
      </div>




      <div id="marco-informativo" className="absolute block w-full marco-informativo py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-8 md:px-16 lg:px-40 -top-full">
        <div className="flex flex-col md:flex-row w-full text-sm sm:text-lg md:text-xl lg:text-2xl gap-4 md:gap-0">
          <div className="w-full md:w-1/2 h-[200px] sm:h-[300px] md:h-[350px] lg:h-[420px] overflow-hidden">
            <Image width={1000 / 2} height={500} className="w-full h-full object-cover" src="/brand.png" alt="cuadro_01" />
          </div>
          <div className="w-full md:w-1/2 md:ml-4 lg:ml-8">
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl mb-2 sm:mb-3 md:mb-4">{["", "WOMEX", "SG-MetroRuma", "NVIEW"][position]}</p>
            <p className="text-xs sm:text-sm md:text-base lg:text-md mb-2 sm:mb-3 md:mb-4">{["", "Gestione su negocio de comercio nacional/internacional. WOMEX"
              + " consolida toda la información desde su acuerdo (contrato), pasando por el transporte, estadías"
              + ", pagos y otros. Sea notificado en tiempo real de información crítica para su negocio.",
              "Potencie al máximo sus sistemas de trato de madera, con gestión de producción y"
              + " reporte en pantalla/celular.", "Compare entre periodo el nivel de ventas, gestionando cada"
              + " evento de su negocio. NView es una herramienta perfecta en la determinación de campañas"
              + " exitosas/fallidas para toma de decisiones basadas en estrategias de mercado"][position]}</p>
            <p className="text-xs sm:text-sm md:text-base lg:text-md">Experimente la reportabilidad en tiempo real y ahorre decidiendo mejor
              respecto a sus clientes y productos críticos.</p>
          </div>
        </div>

        {/* Indicadores de posición */}
        {position > 0 && (
          <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1 sm:space-x-2">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all duration-300 ${position === index
                      ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
                      : 'bg-gray-600 hover:bg-gray-400'
                    }`}
                  onClick={() => setPosition(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Botón Inicio responsive */}
      <div className={`absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-2 sm:left-4 md:left-6 lg:left-10 cursor-pointer ${position == 0 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="neon text-4xl sm:text-5xl md:text-6xl lg:text-8xl ml-1 sm:ml-2" onClick={handleBackMenu}>⌂</div>
        <span className="relative neon text-xs sm:text-sm ml-2 sm:ml-4 md:ml-6 -top-1 sm:-top-2 md:-top-3">Inicio</span>
      </div>

      {/* Navegación lateral izquierda responsive */}
      {position > 1 && (
        <div className="absolute top-1/2 left-1 sm:left-2 md:left-4 cursor-pointer transform -translate-y-1/2">
          <div className="neon text-3xl sm:text-4xl md:text-5xl lg:text-6xl" onClick={handlePrevMenu}>‹</div>
        </div>
      )}

      {/* Navegación lateral derecha responsive */}
      {position > 0 && position < 3 && (
        <div className="absolute top-1/2 right-1 sm:right-2 md:right-4 cursor-pointer transform -translate-y-1/2">
          <div className="neon text-3xl sm:text-4xl md:text-5xl lg:text-6xl" onClick={handleNextMenu}>›</div>
        </div>
      )}

      {/* Botón COTIZAR responsive */}
      <div className={`absolute bottom-6 sm:bottom-8 md:bottom-12 lg:bottom-14 cursor-pointer left-1/2 transform -translate-x-1/2 ${position == 0 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="button-container">
          <button className="btn-primary btn-cotizar text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4">COTIZAR</button>
        </div>
      </div>
    </main>
  );
}
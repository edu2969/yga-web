"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function InfoCarrousel({
  sections,
  isVisible,
  quickPromptSelected,
  activeIndex,
  onHome,
  onActiveIndexChange,
}) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isFrameExiting, setIsFrameExiting] = useState(false);
  const transitionTimeout = useRef(null);
  const homeTransitionTimeout = useRef(null);
  const section = sections[activeIndex];
  const logo = section?.imgen_logo || section?.imagen_logo;
  const isFrameTwo = section?.marco === 2;
  const isVertical = section?.layout === "vertical";
  const isPanelVisible = isVisible && !isFrameExiting;

  const navigateTo = (index) => {
    const nextIndex = Math.max(0, Math.min(index, sections.length - 1));
    if (nextIndex === activeIndex || isTransitioning || isExiting) return;

    setIsTransitioning(true);
    transitionTimeout.current = setTimeout(() => {
      onActiveIndexChange?.(nextIndex);
      transitionTimeout.current = setTimeout(
        () => setIsTransitioning(false),
        50,
      );
    }, 250);
  };

  useEffect(
    () => () => {
      clearTimeout(transitionTimeout.current);
      clearTimeout(homeTransitionTimeout.current);
    },
    [],
  );

  const goHome = () => {
    if (isExiting) return;
    clearTimeout(transitionTimeout.current);
    setIsTransitioning(false);
    setIsExiting(true);
    homeTransitionTimeout.current = setTimeout(() => {
      setIsFrameExiting(true);
      homeTransitionTimeout.current = setTimeout(() => {
        setIsExiting(false);
        setIsFrameExiting(false);
        onHome?.();
      }, 500);
    }, 300);
  };

  if (!section) return null;

  return (
    <>
      <section
        aria-live="polite"
        aria-label="Información"
        className={`absolute z-10 transition-all duration-500 ease-out ${
          isFrameTwo
            ? `left-1/2 who-we-are-panel ${
                isPanelVisible ? "who-we-are-visible" : ""
              }`
            : "inset-x-0 marco-informativo marco-informativo-panel py-10 sm:py-12 md:py-12 lg:py-16 px-8 sm:px-10 md:px-20 lg:px-32"
        } ${
          isPanelVisible
            ? isFrameTwo
              ? "bottom-1/2 -translate-x-1/2 translate-y-1/2 opacity-100 visible pointer-events-auto"
              : "bottom-[25%] translate-y-0 opacity-100 visible pointer-events-auto"
            : "-bottom-full translate-y-4 opacity-0 invisible pointer-events-none"
        }`}
      >
        <div
          key={section.id}
          className={`${
            isFrameTwo
              ? "who-we-are-content"
              : "flex flex-col md:flex-row w-full gap-6 md:gap-6 lg:gap-8 items-center px-4 md:pl-16 md:pr-8"
          } transition-all duration-300 ${
            isTransitioning
              ? "translate-y-8 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          {isFrameTwo && isVertical ? (
            <>
              {section.nodo && (
                <div className="who-we-are-node">{section.nodo}</div>
              )}
              <div className="who-we-are-copy">
                <h2 className="font-michroma">{section.titulo}</h2>
                <p>{section.texto}</p>
                {section.subtexto && <p>{section.subtexto}</p>}
              </div>
            </>
          ) : (
            <>
              <div className="relative w-full md:w-1/3 flex justify-center">
                {section.imagen_marco && (
                  <div className="w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] overflow-hidden rounded-lg shadow-2xl">
                    <Image
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                      src={section.imagen_marco}
                      alt={section.titulo || "Imagen de información"}
                    />
                  </div>
                )}
              </div>
              <div className="w-full md:w-2/3 text-white px-10 md:px-12 lg:px-14">
                <div className="mb-4 sm:mb-6 flex items-center gap-4">
                  {logo && (
                    <Image
                      width={96}
                      height={96}
                      className="max-h-16 w-auto object-contain"
                      src={logo}
                      alt=""
                    />
                  )}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
                    {section.titulo}
                  </h2>
                </div>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 leading-relaxed">
                  {section.texto}
                </p>
                <p className="text-sm sm:text-center md:text-lg lg:text-xl leading-relaxed text-gray-300">
                  {section.subtexto}
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      <div
        className={`absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-2 sm:left-4 md:left-6 lg:left-10 z-20 transition-all duration-300 ${
          isVisible && !isExiting
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <button
          type="button"
          className="cursor-pointer"
          onClick={goHome}
          aria-label="Volver al inicio"
        >
          <p className="neon block text-4xl sm:text-5xl md:text-6xl lg:text-8xl">
            ⌂
          </p>
          <p className="relative neon text-xs sm:text-sm -top-1 sm:-top-2 md:-top-3">
            Inicio
          </p>
        </button>
      </div>

      {sections.length > 1 && isVisible && (
        <>
          <div
            className={`transition-all duration-300 ${
              isExiting
                ? "pointer-events-none opacity-0"
                : "opacity-100"
            }`}
          >
            {activeIndex > 0 && (
              <button
                type="button"
                className="absolute top-1/2 left-1 sm:left-2 md:left-4 z-20 -translate-y-1/2 neon text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                onClick={() => navigateTo(activeIndex - 1)}
                aria-label="Sección anterior"
              >
                ‹
              </button>
            )}
            {activeIndex < sections.length - 1 && (
              <button
                type="button"
                className="absolute top-1/2 right-1 sm:right-2 md:right-4 z-20 -translate-y-1/2 neon text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                onClick={() => navigateTo(activeIndex + 1)}
                aria-label="Sección siguiente"
              >
                ›
              </button>
            )}
          </div>

          <div
            className={`absolute bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-7 left-1/2 z-20 -translate-x-1/2 transition-all duration-300 ${
              isExiting
                ? "pointer-events-none translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <div className="flex space-x-1 sm:space-x-2">
              {sections.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                      : "bg-gray-600 hover:bg-gray-400"
                  }`}
                  onClick={() => navigateTo(index)}
                  aria-label={`Ir a ${item.titulo || `sección ${index + 1}`}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {isVisible && !quickPromptSelected && (
        <div
          className={`carousel-cotizar absolute bottom-6 sm:bottom-12 md:bottom-12 lg:bottom-14 left-1/2 z-20 -translate-x-1/2 transition-all duration-300 ${
            isExiting
              ? "pointer-events-none translate-y-4 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="button-container">
            <button className="btn-primary btn-cotizar text-sm sm:text-base md:text-lg lg:text-xl px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4">
              COTIZAR
            </button>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import AIForm from "./AIForm";
import InfoCarrousel from "./InfoCarrousel";

export function getCarouselBackgroundPosition(index, sectionCount) {
  if (sectionCount <= 1) return 50;
  if (sectionCount === 2) return index === 0 ? 33 : 66;
  if (sectionCount === 3) return index * 50;
  return (index * 100) / sectionCount;
}

export default function AIPanel({
  sections = [],
  quickPromptSections = [],
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [quickPromptSelected, setQuickPromptSelected] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const quickPromptSelectedRef = useRef(false);

  useEffect(() => {
    let readyTimeout;
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      readyTimeout = setTimeout(() => setIsReady(true), 800);
    }, 2000);

    return () => {
      clearTimeout(loadingTimeout);
      clearTimeout(readyTimeout);
    };
  }, []);

  const activeSections = quickPromptSelected
    ? quickPromptSections
    : sections;
  const position = getCarouselBackgroundPosition(
    activeIndex,
    activeSections.length,
  );
  const mobilePosition =
    activeSections.length === 3 ? [15, 50, 99][activeIndex] : position;
  const backgroundPosition = {
    "--ai-background-position": isInfoVisible ? `${position}%` : "50%",
    "--ai-background-y-position": isInfoVisible ? "100%" : "19%",
    "--ai-background-mobile-position": isInfoVisible
      ? `${mobilePosition}%`
      : "15%",
  };

  const handleSubmit = () => {
    const hasQuickPrompt =
      quickPromptSelectedRef.current && quickPromptSections.length > 0;
    setQuickPromptSelected(hasQuickPrompt);

    const sectionsToShow = hasQuickPrompt ? quickPromptSections : sections;
    if (sectionsToShow.length > 0) {
      setActiveIndex(0);
      setIsInfoVisible(true);
    }
  };

  const handleHome = () => {
    setIsInfoVisible(false);
    setQuickPromptSelected(false);
    quickPromptSelectedRef.current = false;
    setActiveIndex(0);
  };

  return (
    <main className="ai-form-scene absolute left-0 top-0 h-screen w-full overflow-hidden">
      {isLoading && (
        <div className="absolute z-50 flex h-screen w-full items-center justify-center bg-black">
          <div className="flex flex-col items-center">
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
            <div className="font-michroma neon text-lg">
              INICIANDO SISTEMA...
            </div>
          </div>
        </div>
      )}

      <div
        className={`ai-form-background absolute h-screen w-full bg-[url('/backgroud-yga.jpg')] bg-no-repeat transition-all duration-700 ease-out ${
          isInfoVisible ? "opacity-30" : "opacity-100"
        }`}
        style={backgroundPosition}
      >
        <div
          className={`ai-form-background absolute h-screen w-full bg-[url('/conectores-yga.svg')] bg-no-repeat transition-all duration-700 ease-out ${
            isInfoVisible ? "opacity-20" : "opacity-100"
          }`}
          style={backgroundPosition}
        />
      </div>

      <div
        className={`absolute z-10 h-screen w-full bg-black transition-opacity duration-700 ${
          isReady ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      />

      <AIForm
        isActive={!isInfoVisible}
        isReady={isReady}
        onSubmit={handleSubmit}
        onQuickPromptSelected={() => {
          quickPromptSelectedRef.current = true;
        }}
      />
      <InfoCarrousel
        sections={activeSections}
        isVisible={isInfoVisible}
        quickPromptSelected={quickPromptSelected}
        activeIndex={activeIndex}
        onHome={handleHome}
        onActiveIndexChange={setActiveIndex}
      />
    </main>
  );
}

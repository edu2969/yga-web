"use client";

import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import MatrixPrompt from "./MatrixPrompt";

export default function AIForm({
  isActive,
  isReady,
  onSubmit,
  onQuickPromptSelected,
}) {
  const methods = useForm();
  const formRef = useRef(null);
  const [error, setError] = useState("");

  const handleSubmit = (data) => {
    onSubmit?.(data);
  };

  const onError = (errors, event) => console.log(errors, event);

  return (
    <>
      <div
        id="marco-prompt"
        className={`flex flex-col items-center justify-center transition-all duration-700 ease-out ${
          !isReady
            ? "transform -translate-y-full opacity-0"
            : isActive
              ? "absolute w-full text-center transform translate-y-[2%] opacity-100"
              : "transform translate-y-[-100%] opacity-100"
        }`}
      >
        <div className="bg-black/50 py-3 px-3 sm:py-4 sm:px-6 rounded-lg">
          <div className="font-michroma neon text-xl sm:text-2xl md:text-4xl text-center sm:mb-6">
            ¿Qué buscas?
          </div>
          <div className="flex justify-center items-center font-michroma neon text-xs sm:text-sm md:text-xl font-medium leading-5 sm:leading-6 text-gray-400 px-2 sm:px-4">
            <span className="text-center tracking-wide max-w-2xl">
              Es una pregunta <br />
              ¿Cuál es esa pregunta?. <br />
              Escríbela y presiona el chip
            </span>
          </div>
        </div>
        <FormProvider {...methods}>
          <form
            ref={formRef}
            className="mt-0 sm:mt-0 w-full mx-auto px-2 sm:px-4"
            onSubmit={methods.handleSubmit(handleSubmit, onError)}
          >
            <div className="space-y-4 sm:space-y-8">
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <MatrixPrompt
                    error={error}
                    setError={setError}
                    onQuickPromptSelected={onQuickPromptSelected}
                  />
                </div>
              </div>
              <button type="submit" className="hidden" aria-hidden="true" />
            </div>
          </form>
        </FormProvider>
      </div>

      <button
        className={`btn ${isActive ? "block" : "hidden"}`}
        onClick={() => formRef.current?.requestSubmit()}
        aria-label="Enviar pregunta"
      />
    </>
  );
}

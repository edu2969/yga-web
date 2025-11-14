import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";

export default function MatrixPrompt({ error, setError }) {
  const { register, setValue } = useFormContext();
  const [lines, setLines] = useState([]); // historial de consola
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [response, setResponse] = useState(null);
  const maxLines = 8; // máximo de líneas visibles en consola
  const intervalRef = useRef(null);

  // Maneja el envío de la pregunta
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    setResponse(null);
    setProcessing(true);
    setProgress(0);
    // Agrega la pregunta al historial
    setLines((prev) => {
      const newLines = [...prev, { type: "user", text: "> " + input }];
      return newLines.slice(-maxLines);
    });
    setInput("");
    setValue("prompt", "");

    // Animación de progreso
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setProcessing(false);
          // Simula respuesta (éxito o error)
          setTimeout(() => {
            if (error) {
              setLines((prev) => {
                const newLines = [...prev, { type: "error", text: "> " + error }];
                return newLines.slice(-maxLines);
              });
            } else {
              setLines((prev) => {
                const newLines = [...prev, { type: "success", text: "> Respuesta generada correctamente." }];
                return newLines.slice(-maxLines);
              });
            }
          }, 400);
        }
        return prev < 100 ? prev + 10 : 100;
      });
    }, 80);
    // Aquí podrías disparar la animación del marco informativo desde el padre
  };

  // Renderiza las líneas de la consola
  const renderLines = () => {
    return lines.map((line, idx) => {
      if (line.type === "user") {
        return <pre key={idx} className="text-white font-mono text-xs">{line.text}</pre>;
      }
      if (line.type === "error") {
        return <pre key={idx} className="text-red-400 font-mono text-xs">{line.text}</pre>;
      }
      if (line.type === "success") {
        return <pre key={idx} className="text-green-400 font-mono text-xs">{line.text}</pre>;
      }
      if (line.type === "progress") {
        return <pre key={idx} className="text-green-400 font-mono text-xs">{line.text}</pre>;
      }
      return null;
    });
  };

  // Agrega línea de progreso si está procesando
  const visibleLines = processing
    ? [...lines, { type: "progress", text: `> Procesando solicitud... ${progress}%` }].slice(-maxLines)
    : lines.slice(-maxLines);

  return (
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
        <div className="relative">
          <div className="matrix-textarea h-40 overflow-hidden flex flex-col justify-end px-2 py-2" style={{ minHeight: "160px", maxHeight: "180px" }}>
            {visibleLines.map((line, idx) => {
              if (line.type === "user") return <pre key={idx} className="text-white font-mono text-xs">{line.text}</pre>;
              if (line.type === "error") return <pre key={idx} className="text-red-400 font-mono text-xs">{line.text}</pre>;
              if (line.type === "success") return <pre key={idx} className="text-green-400 font-mono text-xs">{line.text}</pre>;
              if (line.type === "progress") return <pre key={idx} className="text-green-400 font-mono text-xs">{line.text}</pre>;
              return null;
            })}
          </div>
          <div className="absolute left-0 right-0 bottom-0 px-2 pb-2">
            <input
              type="text"
              autoComplete="off"
              className="w-full bg-transparent border-none outline-none text-white font-mono text-xs"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={processing}
              placeholder={processing ? "" : "> Escribe tu pregunta..."}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!processing && input.trim()) {
                    handleSend(e);
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

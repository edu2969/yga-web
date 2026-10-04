import { useState, useRef, useEffect, useCallback } from "react";

export default function MatrixPrompt({ error, setError, onQuickPromptSelected }) {
  const [lines, setLines] = useState([{ type: "user", text: "> ", editable: true }]); // Inicia con línea editable con espacio
  const [processing, setProcessing] = useState(false);
  const maxLines = 8; // Máximo de líneas visibles
  const responseTimeoutRef = useRef(null);
  const presetTimeoutRef = useRef(null);
  const scrollRef = useRef(null); // Ref para el contenedor de scroll
  const editableRef = useRef(null); // Ref para la línea editable actual
  const responseRef = useRef(null);
  const draftTextRef = useRef("> ");
  const isTypingPresetRef = useRef(false);
  const [isTypingPreset, setIsTypingPreset] = useState(false);
  const hasEditableLine = Boolean(lines[lines.length - 1]?.editable);
  const getTypingDelay = () => 12 + Math.random() * 5;

  const updateDraftText = useCallback((text, moveCaretToEnd = false) => {
    draftTextRef.current = text;
    const editable = editableRef.current;
    if (!editable) return;

    editable.textContent = text;
    if (moveCaretToEnd) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editable);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []);

  // Scroll automático al bottom cuando cambien las líneas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Enfoca el editor solo cuando aparece una nueva línea editable.
  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [hasEditableLine, lines.length]);

  useEffect(() => {
    const focusPromptOnKey = (event) => {
      if (isTypingPresetRef.current) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      const editable = editableRef.current;
      if (!editable || document.activeElement === editable) return;

      editable.focus();

      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key.length === 1) {
        event.preventDefault();
        updateDraftText(`${draftTextRef.current}${event.key}`, true);
      } else if (event.key === "Backspace") {
        event.preventDefault();
        updateDraftText(
          draftTextRef.current.length > 2
            ? draftTextRef.current.slice(0, -1)
            : "> ",
          true,
        );
      }
    };

    window.addEventListener("keydown", focusPromptOnKey, true);
    return () => window.removeEventListener("keydown", focusPromptOnKey, true);
  }, [updateDraftText]);

  useEffect(() => () => {
    clearTimeout(presetTimeoutRef.current);
    clearTimeout(responseTimeoutRef.current);
    isTypingPresetRef.current = false;
  }, []);

  const typePreset = (text) => {
    if (processing || isTypingPresetRef.current) return;

    if (!editableRef.current) return;

    onQuickPromptSelected?.();
    clearTimeout(presetTimeoutRef.current);
    isTypingPresetRef.current = true;
    setIsTypingPreset(true);
    editableRef.current?.focus();
    updateDraftText("> ");

    let index = 0;
    const typeNextCharacter = () => {
      if (index >= text.length) {
        clearTimeout(presetTimeoutRef.current);
        isTypingPresetRef.current = false;
        setIsTypingPreset(false);
        handleSend({ type: "user", text: `> ${text}`, editable: true });
        return;
      }

      const nextText = `> ${text.slice(0, index + 1)}`;
      updateDraftText(nextText);
      index += 1;
      presetTimeoutRef.current = setTimeout(
        typeNextCharacter,
        getTypingDelay(),
      );
    };
    presetTimeoutRef.current = setTimeout(
      typeNextCharacter,
      getTypingDelay(),
    );
  };

  // Función para escribir la respuesta letra a letra
  const typeResponse = (fullText) => {
    let index = 0;
    const typeNextCharacter = () => {
      index += 1;
      if (responseRef.current) {
        responseRef.current.textContent = `> ${fullText.slice(0, index)}`;
      }

      if (index === fullText.length) {
        setProcessing(false);
        setLines((prev) => [
          ...prev.slice(0, -1),
          { type: "response", text: `> ${fullText}` },
          { type: "user", text: "> ", editable: true },
        ].slice(-maxLines));
        draftTextRef.current = "> ";
        return;
      }

      responseTimeoutRef.current = setTimeout(
        typeNextCharacter,
        getTypingDelay(),
      );
    };
    responseTimeoutRef.current = setTimeout(
      typeNextCharacter,
      getTypingDelay(),
    );
  };

  // Maneja el envío (Enter en la línea editable)
  const handleSend = async (submittedLine = lines[lines.length - 1]) => {
    const currentLine = submittedLine;
    if (!currentLine.text.trim() || currentLine.text === ">" || processing) return;

    setProcessing(true);
    draftTextRef.current = "> ";

    // Congela la línea actual como usuario
    setLines((prev) => [
      ...prev.slice(0, -1),
      { ...currentLine, editable: false },
      { type: "response", text: "> " } // Agrega nueva línea para la respuesta
    ]);

    // Simula respuesta después de un breve delay
    setTimeout(() => {
      const isSuccess = Math.random() > 0.5;
      const responseText = isSuccess ? "Llegaste al lugar correcto. Presiona el chip" : "Entiendo. Te ayudaremos. Presiona el chip.";
      typeResponse(responseText);
    }, 500);
  };

  // Maneja cambios en la línea editable
  const handleInputChange = (e) => {
    const newText = e.currentTarget.textContent || "";
    // Asegura que siempre empiece con "> "
    const textAfterPrompt = newText.startsWith("> ") ? newText.slice(2) : newText.startsWith(">") ? newText.slice(1) : newText;
    const normalizedText = `> ${textAfterPrompt}`;
    draftTextRef.current = normalizedText;
    if (newText !== normalizedText) {
      updateDraftText(normalizedText);
    }
  };

  // Maneja Enter en la línea editable
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend({
        type: "user",
        text: draftTextRef.current,
        editable: true,
      });
    }
  };

  return (
    <div className="matrix-terminal-container mx-1 sm:mx-4 md:mx-8 lg:mx-12">
      <div className="mb-3 flex flex-wrap justify-center gap-2">
        {[
          { label: "Quienes somos", prompt: "¿Qué es yGa?" },
          { label: "Contacto", prompt: "¿Cómo me contacto con ustedes?" },
          { label: "Portfolio", prompt: "Muéstrame qué trabajos han hecho" },
        ].map(({ label, prompt }) => (
          <button
            key={label}
            type="button"
            className="rounded border border-cyan-400/70 bg-slate-950/80 px-3 py-1.5 font-michroma text-xs text-cyan-100 transition-colors hover:bg-cyan-950/80 disabled:cursor-wait disabled:opacity-60 sm:text-sm"
            disabled={processing || isTypingPreset}
            onClick={() => typePreset(prompt)}
          >
            {label}
          </button>
        ))}
      </div>
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
          {/* Área de texto con scroll hacia abajo */}
          <div 
            ref={scrollRef}
            className="matrix-textarea h-40 overflow-y-auto flex flex-col px-2 py-2 text-left"  // Quitado pl-4 para alinear a la izquierda
            style={{ minHeight: "160px", maxHeight: "180px" }}
          >
            {lines.slice(-maxLines).map((line, idx) => (
              <div key={idx} className="font-mono text-sm" style={{ textIndent: '0px', marginLeft: '0px' }}>  {/* Evita indentación */}
                {line.editable ? (
                  <div
                    ref={editableRef}  // Ref para enfocar
                    contentEditable
                    suppressContentEditableWarning
                    className={`text-white focus:outline-none text-left ${processing ? 'cursor-not-allowed' : 'cursor-text'}`}
                    style={{ textIndent: '0px', marginLeft: '0px', whiteSpace: 'pre' }}  // Evita indentación
                    onInput={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                  >
                    {line.text}
                  </div>
                ) : (
                  <pre
                    ref={line.type === "response" ? responseRef : undefined}
                    className={`text-left ${line.type === "user" ? "text-white" : line.type === "response" ? "text-green-400" : "text-red-400"}`}
                    style={{ textIndent: '0px', marginLeft: '0px' }}
                  >
                    {line.text}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
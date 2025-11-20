import { useState, useRef, useEffect } from "react";

export default function MatrixPrompt({ error, setError }) {
  const [lines, setLines] = useState([{ type: "user", text: "> ", editable: true }]); // Inicia con línea editable con espacio
  const [processing, setProcessing] = useState(false);
  const maxLines = 8; // Máximo de líneas visibles
  const intervalRef = useRef(null);
  const scrollRef = useRef(null); // Ref para el contenedor de scroll
  const editableRef = useRef(null); // Ref para la línea editable actual

  // Scroll automático al bottom cuando cambien las líneas
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Enfoca la línea editable cuando cambie lines
  useEffect(() => {
    if (editableRef.current) {
      editableRef.current.focus();
      // Coloca el cursor al final del texto (después de "> ")
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false); // Al final
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [lines]); // Se ejecuta cada vez que lines cambie

  // Función para escribir la respuesta letra a letra
  const typeResponse = (fullText, isSuccess) => {
    let currentText = "";
    let index = 0;
    intervalRef.current = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText[index];
        setLines((prev) => [
          ...prev.slice(0, -1), // Remueve la línea anterior (usuario)
          { type: "response", text: `> ${currentText}` } // Actualiza la respuesta letra a letra en la nueva línea
        ]);
        index++;
      } else {
        clearInterval(intervalRef.current);
        setProcessing(false);
        // Agrega nueva línea editable después de la respuesta
        setLines((prev) => [
          ...prev,
          { type: "user", text: "> ", editable: true }
        ].slice(-maxLines));
      }
    }, 20); // Velocidad de escritura más rápida (20ms por letra)
  };

  // Maneja el envío (Enter en la línea editable)
  const handleSend = async () => {
    const currentLine = lines[lines.length - 1];
    if (!currentLine.text.trim() || currentLine.text === ">" || processing) return;

    setProcessing(true);

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
      typeResponse(responseText, isSuccess);
    }, 500);
  };

  // Maneja cambios en la línea editable
  const handleInputChange = (e, index) => {
    const newText = e.target.textContent || "";
    // Asegura que siempre empiece con "> "
    const textAfterPrompt = newText.startsWith("> ") ? newText.slice(2) : newText.startsWith(">") ? newText.slice(1) : newText;
    setLines((prev) => prev.map((line, i) => 
      i === index ? { ...line, text: "> " + textAfterPrompt } : line
    ));
  };

  // Maneja Enter en la línea editable
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

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
                    onInput={(e) => handleInputChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                  >
                    {line.text}
                  </div>
                ) : (
                  <pre className={`text-left ${line.type === "user" ? "text-white" : line.type === "response" ? "text-green-400" : "text-red-400"}`} style={{ textIndent: '0px', marginLeft: '0px' }}>
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
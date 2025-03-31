
import React, { useState, useEffect } from "react";
import CodeLine from "./CodeLine";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  animationDelay?: number;
  lineDelay?: number;
  highlightedLines?: number[];
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "javascript",
  title,
  animationDelay = 0,
  lineDelay = 100,
  highlightedLines = [],
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    
    const lines = code.split("\n");
    setCodeLines(lines);
    setLineNumbers(Array.from({ length: lines.length }, (_, i) => i + 1));
    
    return () => clearTimeout(timer);
  }, [code, animationDelay]);
  
  return (
    <div 
      className={`${isVisible ? "opacity-100" : "opacity-0"} 
        transition-opacity duration-500 rounded-lg bg-code-bg p-4 my-4
        border border-muted/20 glass-card ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-muted/20 pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs text-muted-foreground">{title}</span>
          </div>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      
      <div className="font-mono text-sm overflow-x-auto">
        <div className="flex">
          <div className="text-muted-foreground text-right pr-4 border-r border-muted/20 select-none">
            {lineNumbers.map((num, index) => (
              <div 
                key={index} 
                className="px-2 select-none"
              >
                {num}
              </div>
            ))}
          </div>
          <div className="flex-1 pl-4">
            {codeLines.map((line, index) => (
              <CodeLine 
                key={index} 
                text={line}
                delay={animationDelay + (index + 1) * lineDelay}
                highlighted={highlightedLines.includes(index + 1)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;

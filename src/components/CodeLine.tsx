
import React, { useEffect, useState } from "react";

interface CodeLineProps {
  text: string;
  delay: number;
  className?: string;
  highlighted?: boolean;
}

const CodeLine: React.FC<CodeLineProps> = ({ 
  text, 
  delay,
  className = "",
  highlighted = false
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  const getColoredText = () => {
    // Apply syntax highlighting
    return text
      .replace(/(".*?")/g, '<span class="text-code-syntax5">$1</span>') // strings in yellow
      .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from)\b/g, 
               '<span class="text-code-syntax1">$1</span>') // keywords in pink
      .replace(/\b(true|false|null|undefined|this)\b/g, 
               '<span class="text-code-syntax4">$1</span>') // special values in purple
      .replace(/\b(\w+)(?=\()/g, '<span class="text-code-syntax3">$1</span>') // function calls in green
      .replace(/\b(\d+)\b/g, '<span class="text-code-syntax2">$1</span>') // numbers in cyan
      .replace(/(\/\/.*)/g, '<span class="text-code-comment">$1</span>'); // comments in blue-gray
  };
  
  return (
    <div 
      className={`code-line ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-300 ${
        highlighted ? "bg-primary/10" : ""
      } ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        paddingLeft: `${(text.match(/^\s*/) || [""])[0].length * 0.5}rem` 
      }}
      dangerouslySetInnerHTML={{ __html: getColoredText() }}
    />
  );
};

export default CodeLine;

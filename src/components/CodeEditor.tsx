
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeBlock from "./CodeBlock";
import TypingEffect from "./TypingEffect";

const codeExamples = [
  {
    id: 1,
    title: "Hello World",
    language: "javascript",
    code: `// A simple Hello World
console.log("Hello, World!");

// Using a function
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Developer"));`,
    highlightedLines: [2, 7]
  },
  {
    id: 2,
    title: "React Component",
    language: "jsx",
    code: `import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(prev => prev + 1);
  };
  
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={increment}>
        Increment
      </button>
    </div>
  );
};

export default Counter;`,
    highlightedLines: [4, 6, 7, 11, 12, 13]
  },
  {
    id: 3,
    title: "Data Fetching",
    language: "javascript",
    code: `// Async function to fetch data
async function fetchUserData(userId) {
  try {
    const response = await fetch(
      \`https://api.example.com/users/\${userId}\`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

// Usage
fetchUserData(123)
  .then(user => {
    console.log("User:", user);
  });`,
    highlightedLines: [4, 5, 11, 19, 20, 21]
  }
];

const CodeEditor = () => {
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const [showArrow, setShowArrow] = useState(false);
  
  const activeExample = codeExamples[activeExampleIndex];
  
  const handleNextExample = () => {
    setTyping(true);
    setShowArrow(false);
    setActiveExampleIndex((prevIndex) => 
      (prevIndex + 1) % codeExamples.length
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowArrow(true);
    }, 4000); // Show arrow after the code has been displayed
    
    return () => clearTimeout(timer);
  }, [activeExampleIndex]);
  
  return (
    <div className="rounded-lg border bg-card p-6 shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold">
            <TypingEffect 
              text={activeExample.title}
              speed={50}
              delay={500}
              onComplete={() => setTyping(false)}
              className="text-primary"
            />
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {!typing && `Example ${activeExampleIndex + 1} of ${codeExamples.length}`}
          </p>
        </div>
        <Button 
          onClick={handleNextExample} 
          variant="outline"
          size="sm"
          className={`transition-opacity duration-300 ${showArrow ? 'opacity-100' : 'opacity-0'}`}
        >
          Next Example
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <CodeBlock
        code={activeExample.code}
        language={activeExample.language}
        title={`${activeExample.language} - ${activeExample.title}`}
        animationDelay={1000}
        lineDelay={100}
        highlightedLines={activeExample.highlightedLines}
        className="transition-all duration-300"
      />
      
      {!typing && (
        <div className="mt-4 text-sm text-muted-foreground animate-fade-in">
          <p>Try clicking "Next Example" to see more code samples</p>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;

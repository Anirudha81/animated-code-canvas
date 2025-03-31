
import { useState, useEffect } from "react";
import ParticleContainer from "./ParticleContainer";
import CodeEditor from "./CodeEditor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CodeCanvas = () => {
  const [isInteractive, setIsInteractive] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleInteractiveToggle = () => {
    setIsInteractive(!isInteractive);
    toast({
      title: isInteractive ? "Interactive mode disabled" : "Interactive mode enabled",
      description: isInteractive 
        ? "Code animations will play automatically" 
        : "Try hovering over code elements to see effects",
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 md:p-8">
      {showWelcome && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10 animate-fade-out">
          <h1 className="text-4xl font-bold text-primary typing-animation">
            Animated Code Canvas
          </h1>
        </div>
      )}
      
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            <span className="text-primary">Animated</span> Code Canvas
          </h1>
          <Button 
            variant="outline" 
            onClick={handleInteractiveToggle}
            className="animate-slide-down"
          >
            {isInteractive ? "Auto Mode" : "Interactive Mode"}
          </Button>
        </div>
        
        <ParticleContainer count={30} className="min-h-[70vh] rounded-lg border border-muted p-4">
          <div className="grid gap-8">
            <div className="animate-slide-up">
              <CodeEditor />
            </div>
            
            <div className="rounded-lg border bg-card p-6 shadow animate-slide-up" style={{ animationDelay: "200ms" }}>
              <h3 className="text-xl font-semibold mb-4">About This Demo</h3>
              <p className="text-muted-foreground">
                This animated code canvas demonstrates smooth transitions, code syntax highlighting, 
                typing effects, and interactive particles using React and Tailwind CSS.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-md bg-muted/10 border border-muted/20 hover:bg-muted/20 transition-colors">
                  <h4 className="font-medium mb-2">Animation Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Typing effects for text</li>
                    <li>• Code highlighting animations</li>
                    <li>• Floating particles</li>
                    <li>• Smooth transitions between examples</li>
                  </ul>
                </div>
                <div className="p-4 rounded-md bg-muted/10 border border-muted/20 hover:bg-muted/20 transition-colors">
                  <h4 className="font-medium mb-2">Code Features</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Syntax highlighting</li>
                    <li>• Line numbers</li>
                    <li>• Line highlighting</li>
                    <li>• Multiple code examples</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ParticleContainer>
      </div>
    </div>
  );
};

export default CodeCanvas;

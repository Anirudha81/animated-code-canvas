
import { useEffect, useRef } from "react";

interface ParticleProps {
  size?: number;
  color?: string;
  maxVelocity?: number;
  className?: string;
}

const Particle = ({ 
  size = 4, 
  color = "#BD93F9", 
  maxVelocity = 1,
  className = "",
}: ParticleProps) => {
  const particleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!particleRef.current) return;
    
    const particle = particleRef.current;
    
    // Random position within the parent container
    const parent = particle.parentElement;
    if (!parent) return;
    
    const parentRect = parent.getBoundingClientRect();
    const x = Math.random() * parentRect.width;
    const y = Math.random() * parentRect.height;
    
    // Random velocity
    const vx = (Math.random() - 0.5) * maxVelocity;
    const vy = (Math.random() - 0.5) * maxVelocity;
    
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    let animationFrameId: number;
    
    const animate = () => {
      if (!particle || !parent) return;
      
      const rect = particle.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      
      let nextX = rect.left - parentRect.left + vx;
      let nextY = rect.top - parentRect.top + vy;
      
      // Bounce off walls
      if (nextX <= 0 || nextX + rect.width >= parentRect.width) {
        nextX = Math.max(0, Math.min(nextX, parentRect.width - rect.width));
      }
      
      if (nextY <= 0 || nextY + rect.height >= parentRect.height) {
        nextY = Math.max(0, Math.min(nextY, parentRect.height - rect.height));
      }
      
      particle.style.left = `${nextX}px`;
      particle.style.top = `${nextY}px`;
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxVelocity]);
  
  return (
    <div 
      ref={particleRef}
      className={`code-particle ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        backgroundColor: color,
      }}
    />
  );
};

export default Particle;

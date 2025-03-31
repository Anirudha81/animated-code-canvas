
import React from "react";
import Particle from "./Particle";

interface ParticleContainerProps {
  count?: number;
  className?: string;
  children?: React.ReactNode;
}

const ParticleContainer: React.FC<ParticleContainerProps> = ({
  count = 20,
  className = "",
  children
}) => {
  const particleColors = [
    "#FF79C6", // pink
    "#8BE9FD", // cyan
    "#50FA7B", // green
    "#BD93F9", // purple
    "#F1FA8C", // yellow
  ];
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Particle 
          key={index}
          size={Math.floor(Math.random() * 4) + 2}
          color={particleColors[Math.floor(Math.random() * particleColors.length)]}
          maxVelocity={0.2}
        />
      ))}
      {children}
    </div>
  );
};

export default ParticleContainer;

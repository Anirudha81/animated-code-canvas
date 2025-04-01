
import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundRef.current) return;
      
      const { clientX, clientY } = e;
      const xOffset = (clientX / window.innerWidth - 0.5) * 10;
      const yOffset = (clientY / window.innerHeight - 0.5) * 10;
      
      backgroundRef.current.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-100 ease-out"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')", 
          filter: "brightness(0.7)"
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/40 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl space-y-6"
        >
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl font-light text-white/90"
          >
            Welcome to
          </motion.h2>
          
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-7xl font-medium text-white tracking-wide"
          >
            Khare <br /> Construction
          </motion.h1>
          
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-3xl font-light text-white/80 mt-2"
          >
            Best Properties in Katni
          </motion.h3>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-white/70 max-w-md"
          >
            Introducing a new way of living in the prime locations of Katni. 
            Find your perfect duplex or plot with Khare Construction.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button variant="outline" className="mt-4 border-2 border-white text-white bg-transparent hover:bg-white/10">
              Watch Video
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

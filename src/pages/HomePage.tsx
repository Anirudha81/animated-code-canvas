
import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InquireForm from "@/components/InquireForm";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <InquireForm />
      <HeroSection />
      
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-neutral-100"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-neutral-800 mb-6">About Khare Construction</h2>
            <p className="text-neutral-600 mb-8">
              With over 25 years of experience in the construction industry, Khare Construction 
              has established itself as a leader in building premium residential and commercial 
              properties in Katni and surrounding areas. Our commitment to quality, innovation, 
              and customer satisfaction has made us the preferred choice for those seeking 
              exceptional construction services.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { title: "25+", subtitle: "Years of Experience" },
                { title: "500+", subtitle: "Projects Completed" },
                { title: "98%", subtitle: "Client Satisfaction" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-4xl font-bold text-neutral-800 mb-2">{item.title}</h3>
                  <p className="text-neutral-600">{item.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-neutral-800 mb-12 text-center">Our Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Luxury Apartments", 
                location: "Central Katni", 
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              },
              { 
                title: "Modern Office Complex", 
                location: "Business District", 
                image: "https://images.unsplash.com/photo-1486718448742-163732cd1544?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              },
              { 
                title: "Residential Villas", 
                location: "Suburban Katni", 
                image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              }
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-lg shadow-md cursor-pointer"
              >
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <p className="text-white/80">{project.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      <Footer />
    </div>
  );
};

export default HomePage;


import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full py-4 bg-white/90 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-neutral-800">Khare Construction</h1>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-neutral-700 hover:text-neutral-900 transition-colors hover:underline underline-offset-4">
              About
            </Link>
            <Link to="/" className="text-neutral-700 hover:text-neutral-900 transition-colors hover:underline underline-offset-4">
              The Building
            </Link>
            <Link to="/" className="text-neutral-700 hover:text-neutral-900 transition-colors hover:underline underline-offset-4">
              Location
            </Link>
            <Link to="/" className="text-neutral-700 hover:text-neutral-900 transition-colors hover:underline underline-offset-4">
              Amenities
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="default" className="bg-neutral-800 hover:bg-neutral-700 text-white">
            Inquire
          </Button>
          <div className="hidden md:flex items-center space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 hover:text-neutral-900 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 hover:text-neutral-900 transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 hover:text-neutral-900 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

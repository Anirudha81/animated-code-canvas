
import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Khare Construction</h3>
            <p className="text-neutral-300">
              Building dreams into reality since 1995. Quality construction services for residential and commercial projects.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Our Projects</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Properties</a></li>
              <li><a href="#" className="text-neutral-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Contact Info</h4>
            <ul className="space-y-2 text-neutral-300">
              <li>123 Construction Avenue, Katni</li>
              <li>Madhya Pradesh, India</li>
              <li>+91 123 456 7890</li>
              <li>info@khareconstruction.com</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-center text-neutral-400">
          <p>&copy; {new Date().getFullYear()} Khare Construction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

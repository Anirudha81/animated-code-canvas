
import React from "react";
import { Facebook, Instagram, Youtube, LogOut, User, Building } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <nav className="w-full py-4 bg-white/90 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold text-neutral-800">Khare Construction</Link>
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
            {user && (
              <Link to="/projects" className="text-neutral-700 hover:text-neutral-900 transition-colors hover:underline underline-offset-4 flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span>Projects</span>
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-neutral-700">
                <User className="w-4 h-4" />
                <span>Welcome, {user.email}</span>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="default" className="bg-neutral-800 hover:bg-neutral-700 text-white">
                Inquire
              </Button>
              <Link to="/auth">
                <Button variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
          
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

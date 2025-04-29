import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useAuth } from "@/App";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // After mounting, we can safely show the theme toggle
  useEffect(() => {
    setMounted(true);
    
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`w-full py-4 px-4 sm:px-6 lg:px-8 bg-transparent backdrop-blur-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}>
      <nav className={`bg-white text-black py-2 px-4 md:px-6 rounded-full ${scrolled ? "shadow-lg" : "shadow-md"} max-w-6xl mx-auto transition-all duration-300 ease-in-out`}>
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl md:text-2xl font-bold flex items-center transition-transform duration-300 ease-in-out hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-primary">Schedly</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/features" className="text-black font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-black font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            
            {/* Theme Toggle */}
            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="text-black"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
            
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-black font-medium hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => logout()}
                  className="text-black font-medium hover:text-primary transition-colors"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-black font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary text-white font-semibold hover:bg-primary/90 transition-colors">
                    Sign Up Free
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle for Mobile */}
            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="text-black"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-black" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white text-black border-l border-gray-200">
                <div className="flex flex-col space-y-4 mt-8">
                  <SheetClose asChild>
                    <Link href="/features" className="text-xl py-2 font-medium hover:text-primary transition-colors">
                      Features
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/pricing" className="text-xl py-2 font-medium hover:text-primary transition-colors">
                      Pricing
                    </Link>
                  </SheetClose>
                  
                  {isAuthenticated ? (
                    <>
                      <SheetClose asChild>
                        <Link href="/dashboard" className="text-xl py-2 font-medium hover:text-primary transition-colors">
                          Dashboard
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          onClick={() => logout()}
                          className="text-xl text-black justify-start p-2 font-medium hover:bg-transparent hover:text-primary"
                        >
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/login" className="text-xl py-2 font-medium hover:text-primary transition-colors">
                          Login
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/signup">
                          <Button className="w-full bg-primary text-white font-semibold mt-4 hover:bg-primary/90">
                            Sign Up Free
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </div>
  );
}
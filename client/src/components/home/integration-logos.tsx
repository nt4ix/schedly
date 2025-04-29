import { useState, useEffect } from "react";

export default function IntegrationLogos() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-lg mb-6 text-foreground/70 font-medium">
          Trusted by remote teams worldwide
        </h3>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {/* Google Calendar */}
          <div className={`w-24 md:w-28 opacity-60 hover:opacity-100 transition-opacity duration-300 ${isVisible ? 'slide-up' : 'opacity-0'}`} style={{ transitionDelay: '100ms' }}>
            <svg viewBox="0 0 24 24" className="w-full h-auto">
              <path fill="currentColor" d="M21.5 5.5L18.5 5.5L18.5 4.5C18.5 3.947 18.053 3.5 17.5 3.5C16.947 3.5 16.5 3.947 16.5 4.5L16.5 5.5L7.5 5.5L7.5 4.5C7.5 3.947 7.053 3.5 6.5 3.5C5.947 3.5 5.5 3.947 5.5 4.5L5.5 5.5L2.5 5.5C1.397 5.5 0.5 6.397 0.5 7.5L0.5 21.5C0.5 22.603 1.397 23.5 2.5 23.5L21.5 23.5C22.603 23.5 23.5 22.603 23.5 21.5L23.5 7.5C23.5 6.397 22.603 5.5 21.5 5.5ZM21.5 21.5L2.5 21.5L2.5 10.5L21.5 10.5L21.5 21.5ZM6.5 14.5C7.603 14.5 8.5 13.603 8.5 12.5C8.5 11.397 7.603 10.5 6.5 10.5C5.397 10.5 4.5 11.397 4.5 12.5C4.5 13.603 5.397 14.5 6.5 14.5ZM12 14.5C13.103 14.5 14 13.603 14 12.5C14 11.397 13.103 10.5 12 10.5C10.897 10.5 10 11.397 10 12.5C10 13.603 10.897 14.5 12 14.5ZM17.5 14.5C18.603 14.5 19.5 13.603 19.5 12.5C19.5 11.397 18.603 10.5 17.5 10.5C16.397 10.5 15.5 11.397 15.5 12.5C15.5 13.603 16.397 14.5 17.5 14.5Z" />
            </svg>
            <p className="text-center text-xs mt-2 text-foreground/70">Google Calendar</p>
          </div>
          
          {/* Outlook */}
          <div className={`w-24 md:w-28 opacity-60 hover:opacity-100 transition-opacity duration-300 ${isVisible ? 'slide-up' : 'opacity-0'}`} style={{ transitionDelay: '200ms' }}>
            <svg viewBox="0 0 24 24" className="w-full h-auto">
              <path fill="currentColor" d="M21,4H3A2,2 0 0,0 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18V6A2,2 0 0,0 21,4M21,6L12,11L3,6H21M3,18V8L12,13L21,8V18H3Z" />
            </svg>
            <p className="text-center text-xs mt-2 text-foreground/70">Outlook</p>
          </div>
          
          {/* Zoom */}
          <div className={`w-24 md:w-28 opacity-60 hover:opacity-100 transition-opacity duration-300 ${isVisible ? 'slide-up' : 'opacity-0'}`} style={{ transitionDelay: '300ms' }}>
            <svg viewBox="0 0 24 24" className="w-full h-auto">
              <path fill="currentColor" d="M24 12C24 17.04 20.16 21.2 15.12 21.84V18.18C17.76 17.56 19.82 15.08 19.82 12.18C19.82 8.82 17.06 6.06 13.7 6.06C10.36 6.06 7.6 8.84 7.6 12.18C7.6 15.08 9.66 17.56 12.3 18.18V21.84C7.26 21.2 3.4 17.04 3.4 12C3.4 6.48 7.88 2 13.4 2C18.92 2 23.4 6.48 23.4 12M13.8 12H17.4V16.36H13.8V12M6.6 12H10.2V16.36H6.6V12Z" />
            </svg>
            <p className="text-center text-xs mt-2 text-foreground/70">Zoom</p>
          </div>
          
          {/* Microsoft Teams */}
          <div className={`w-24 md:w-28 opacity-60 hover:opacity-100 transition-opacity duration-300 ${isVisible ? 'slide-up' : 'opacity-0'}`} style={{ transitionDelay: '400ms' }}>
            <svg viewBox="0 0 24 24" className="w-full h-auto">
              <path fill="currentColor" d="M9.95 9.812V13.562C9.95 13.812 9.737 14.025 9.487 14.025H5.512C5.262 14.025 5.05 13.812 5.05 13.562V8.5C5.05 8.25 5.262 8.037 5.512 8.037H9.487C9.737 8.037 9.95 8.25 9.95 8.5V9.812ZM14.238 9.758H11V6.52H10.638C9.337 6.52 8.288 7.57 8.288 8.871V9.52H14.238V9.758ZM12.475 14.52C13.36 14.52 14.08 13.8 14.08 12.91C14.08 12.025 13.36 11.305 12.475 11.305C11.585 11.305 10.865 12.025 10.865 12.91C10.865 13.8 11.585 14.52 12.475 14.52ZM14.238 9.758H16.8C17.467 9.758 18 10.292 18 10.958V17.995C18 18.662 17.467 19.195 16.8 19.195H8.038C7.371 19.195 6.838 18.662 6.838 17.995V15.195H9.35C9.85 15.195 10.262 14.782 10.262 14.282C10.262 13.782 9.85 13.37 9.35 13.37H6.838V10.958C6.838 10.292 7.371 9.758 8.038 9.758H10.6V9.52H14.238V9.758Z" />
            </svg>
            <p className="text-center text-xs mt-2 text-foreground/70">Microsoft Teams</p>
          </div>
          
          {/* Apple Calendar */}
          <div className={`w-24 md:w-28 opacity-60 hover:opacity-100 transition-opacity duration-300 ${isVisible ? 'slide-up' : 'opacity-0'}`} style={{ transitionDelay: '500ms' }}>
            <svg viewBox="0 0 24 24" className="w-full h-auto">
              <path fill="currentColor" d="M21.5 3H18.5V1.5C18.5 0.947 18.053 0.5 17.5 0.5C16.947 0.5 16.5 0.947 16.5 1.5V3H7.5V1.5C7.5 0.947 7.053 0.5 6.5 0.5C5.947 0.5 5.5 0.947 5.5 1.5V3H2.5C1.122 3 0 4.122 0 5.5V21.5C0 22.878 1.122 24 2.5 24H21.5C22.878 24 24 22.878 24 21.5V5.5C24 4.122 22.878 3 21.5 3ZM22 21.5C22 21.776 21.776 22 21.5 22H2.5C2.224 22 2 21.776 2 21.5V10H22V21.5ZM22 8H2V5.5C2 5.224 2.224 5 2.5 5H5.5V6.5C5.5 7.053 5.947 7.5 6.5 7.5C7.053 7.5 7.5 7.053 7.5 6.5V5H16.5V6.5C16.5 7.053 16.947 7.5 17.5 7.5C18.053 7.5 18.5 7.053 18.5 6.5V5H21.5C21.776 5 22 5.224 22 5.5V8Z" />
            </svg>
            <p className="text-center text-xs mt-2 text-foreground/70">Apple Calendar</p>
          </div>
        </div>
      </div>
    </section>
  );
}
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function OnboardingPreview() {
  const [currentStep] = useState(1);

  return (
    <section className="py-16 bg-white" id="signup">
      <div className="container mx-auto px-6 md:px-10 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1C4A1C] mb-4">
          Get Started in Minutes
        </h2>
        <p className="text-lg text-neutral-dark text-center mb-12 max-w-2xl mx-auto">
          Our simple onboarding process gets you scheduling right away.
        </p>
        
        {/* Onboarding Preview */}
        <div className="max-w-4xl mx-auto bg-gray-100 rounded-2xl p-4 md:p-8 shadow-lg">
          <div className="flex mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`
                  step-indicator w-10 h-10 rounded-full 
                  ${step === currentStep 
                    ? "bg-[#1C4A1C] text-white" 
                    : "bg-white text-[#1C4A1C] border-2 border-[#1C4A1C]"
                  } 
                  flex items-center justify-center font-bold mr-2
                `}
              >
                {step}
              </div>
            ))}
          </div>
          
          <div id="onboarding-step-1" className="onboarding-step">
            <h3 className="text-2xl font-bold text-[#1C4A1C] mb-4">Connect Your Calendar</h3>
            <p className="text-neutral-dark mb-6">Select the calendar service you want to connect with Schedly.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button className="flex items-center justify-center bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-[#9ACD32] transition-colors">
                <svg className="h-6 w-6 mr-3 text-[#DB4437]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                </svg>
                <span className="font-semibold">Connect Google Calendar</span>
              </button>
              <button className="flex items-center justify-center bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-[#9ACD32] transition-colors">
                <svg className="h-6 w-6 mr-3 text-[#0072C6]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 0v11.408h11.408V0H0zm12.594 0v11.408H24V0H12.594zM0 12.594V24h11.408V12.594H0zm12.594 0V24H24V12.594H12.594z"/>
                </svg>
                <span className="font-semibold">Connect Outlook</span>
              </button>
              <button className="flex items-center justify-center bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-[#9ACD32] transition-colors md:col-span-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-[#1C4A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-semibold">Connect Apple Calendar</span>
              </button>
            </div>
            
            <div className="text-center">
              <Button variant="outline" className="bg-neutral-dark text-white px-4 py-2 rounded-md mr-2 hover:bg-opacity-80 transition-colors">
                Skip for now
              </Button>
              <Button className="bg-[#1C4A1C] text-white px-6 py-2 rounded-md hover:bg-[#2C602C] transition-colors">
                Continue
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link href="/signup">
            <Button className="bg-[#9ACD32] text-[#1C4A1C] font-bold px-8 py-4 rounded-md inline-block hover:bg-[#D4E157] transition-colors">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

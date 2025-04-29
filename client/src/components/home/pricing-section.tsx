import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for individuals just getting started",
    features: [
      "1 calendar connection",
      "Basic scheduling",
      "Standard meeting types",
      "Schedly branding"
    ],
    buttonText: "Get Started",
    buttonLink: "/signup",
    highlighted: false
  },
  {
    name: "Pro",
    price: "12",
    description: "For professionals and small teams",
    features: [
      "Unlimited calendar connections",
      "Advanced scheduling options",
      "Custom branding",
      "Group meeting coordination",
      "Email reminders & notifications"
    ],
    buttonText: "Start Pro Trial",
    buttonLink: "/signup",
    highlighted: true,
    badge: "Most Popular"
  },
  {
    name: "Team",
    price: "30",
    priceDetail: "/user/month",
    description: "For teams and organizations",
    features: [
      "Everything in Pro, plus:",
      "Team dashboard",
      "Shared availability",
      "Admin controls",
      "Priority support",
      "SSO & advanced security"
    ],
    buttonText: "Contact Sales",
    buttonLink: "#contact-sales",
    highlighted: false
  }
];

export default function PricingSection() {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section className="py-16 bg-gray-100" id="pricing">
      <div className="container mx-auto px-6 md:px-10 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1C4A1C] mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-neutral-dark text-center mb-8 max-w-2xl mx-auto">
          Choose the plan that fits your scheduling needs
        </p>
        
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 inline-flex">
            <button 
              className={`px-6 py-2 rounded-full ${
                isMonthly 
                  ? "bg-[#9ACD32] text-[#1C4A1C] font-semibold" 
                  : "text-neutral-dark"
              }`}
              onClick={() => setIsMonthly(true)}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-2 rounded-full ${
                !isMonthly 
                  ? "bg-[#9ACD32] text-[#1C4A1C] font-semibold" 
                  : "text-neutral-dark"
              }`}
              onClick={() => setIsMonthly(false)}
            >
              Annually (20% off)
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`
                relative
                bg-white rounded-xl overflow-hidden shadow-md 
                ${plan.highlighted ? "border-2 border-[#9ACD32] transform md:-translate-y-4" : "border border-gray-100"}
              `}
            >
              {plan.badge && (
                <div className="bg-[#9ACD32] text-[#1C4A1C] text-center py-2 font-semibold">
                  {plan.badge}
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1C4A1C] mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#1C4A1C]">
                    ${isMonthly ? plan.price : (Number(plan.price) * 0.8).toFixed()}
                  </span>
                  <span className="text-neutral-dark">{plan.priceDetail || "/month"}</span>
                </div>
                <p className="text-neutral-dark mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-[#43A047] mt-0.5 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.buttonLink}>
                  <Button 
                    className={`block w-full py-3 rounded-md font-semibold text-center transition-colors ${
                      plan.highlighted
                        ? "bg-[#1C4A1C] text-white hover:bg-[#2C602C]"
                        : "bg-gray-100 text-[#1C4A1C] hover:bg-gray-200"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

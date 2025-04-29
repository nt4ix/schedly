const testimonials = [
  {
    quote: "Schedly has been a game-changer for managing meetings across multiple time zones. It saves us hours each week.",
    name: "Liam Harper",
    title: "Operations Director, TechFlow"
  },
  {
    quote: "As a freelance writer, coordinating meetings with clients globally was always a hassle. Schedly made it so much easier.",
    name: "Emma Clark",
    title: "Freelance Content Writer"
  },
  {
    quote: "Our team of developers can now effortlessly schedule and sync meetings without worrying about time zone differences. Highly recommend",
    name: "Elena Rodriguez",
    title: "Lead Developer, CodeLabs"
  }
];

const brands = [
  { icon: "google", name: "Google" },
  { icon: "microsoft", name: "Microsoft" },
  { icon: "slack", name: "Slack" },
  { icon: "dropbox", name: "Dropbox" },
  { icon: "spotify", name: "Spotify" },
  { icon: "discord", name: "Discord" },
  { icon: "whatsapp", name: "WhatsApp" },
  { icon: "steam", name: "Steam" }
];

export default function Testimonials() {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-6 md:px-10 lg:px-16 max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-8">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className="text-primary">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 inline-block" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-800 text-sm mb-3">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-full mr-2 flex items-center justify-center text-white font-bold text-xs">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-primary text-sm">{testimonial.name}</p>
                  <p className="text-xs text-gray-600">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-center text-primary mb-6">
            Trusted by teams at
          </h3>
          <div className="overflow-x-auto flex gap-6 md:gap-12 animate-marquee">
            {brands.map((brand, index) => (
              <div key={index} className="h-6 text-gray-600 flex-shrink-0">
                <BrandIcon name={brand.icon} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandIcon({ name }: { name: string }) {
  switch (name.toLowerCase()) {
    case 'google':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
        </svg>
      );
    case 'microsoft':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 0v11.408h11.408V0H0zm12.594 0v11.408H24V0H12.594zM0 12.594V24h11.408V12.594H0zm12.594 0V24H24V12.594H12.594z"/>
        </svg>
      );
    case 'slack':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.42 0c-.5 0-.9.4-.9.9v5.28c0 .5.4.9.9.9h.9v-5.28c0-.5-.4-.9-.9-.9zm5.11 3.03h-.88c-.5 0-.9.4-.9.9v.9h.9c.5 0 .9-.4.9-.9v-.9zm0 2.7H8.52c-.5 0-.9.4-.9.9v5.35c0 .5.4.9.9.9h5.99c.5 0 .9-.4.9-.9V6.63c0-.5-.4-.9-.9-.9zm-9-2.7H4.6c-.5 0-.9.4-.9.9v.9h.9c.5 0 .9-.4.9-.9v-.9zm.02 2.7h-.9c-.5 0-.9.4-.9.9v.9h.9c.5 0 .9-.4.9-.9v-.9zm8.99 5.4h.9c.5 0 .9-.4.9-.9v-.88c0-.5-.4-.9-.9-.9h-.9v1.77zm-2.7 2.7h.9c.5 0 .9-.4.9-.9v-.9h-.9c-.5 0-.9.4-.9.9v.9zm-2.7-2.7h-1.8c-.5 0-.9.4-.9.9v.9h.9c.5 0 .9-.4.9-.9v-.9zm-2.7 2.7h.9c.5 0 .9-.4.9-.9v-.9h-.9c-.5 0-.9.4-.9.9v.9z"/>
        </svg>
      );
    case 'dropbox':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 1.807L0 6.02l6 4.25 6-4.25zm6 4.214l-6 4.25 6 4.215 6-4.214zm6-4.214L12 6.02l6 4.25 6-4.25zm-12 12.7l6 4.214 6-4.214-6-4.212z"/>
        </svg>
      );
    case 'spotify':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.46z"/>
        </svg>
      );
    default:
      return <span />;
  }
}

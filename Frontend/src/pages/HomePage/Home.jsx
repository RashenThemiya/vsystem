import { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Header from "./Header";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white font-sans overflow-x-hidden">
      <style>{`
        @keyframes slideImages {
          0% { transform: translateX(0%); }
          20% { transform: translateX(0%); }
          25% { transform: translateX(-100%); }
          45% { transform: translateX(-100%); }
          50% { transform: translateX(-200%); }
          70% { transform: translateX(-200%); }
          75% { transform: translateX(-300%); }
          95% { transform: translateX(-300%); }
          100% { transform: translateX(0%); }
        }

        .animate-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            flex-shrink: 0;
            animation: slideImages 18s infinite ease-in-out;
        }`}</style>
        <Header title="TRANSPORT" breadcrumb="Transport" />
        
      {/* HERO SECTION */}
          <section className="relative w-full h-[85vh] overflow-hidden">
          <div className="absolute inset-0 flex transition-transform duration-[1500ms] ease-in-out animate-slide">
          <img src="/images/slider1.jpg" className="w-full h-full object-cover flex-shrink-0" />
          <img src="/images/slider2.jpg" className="w-full h-full object-cover flex-shrink-0" />
          <img src="/images/slider3.jpg" className="w-full h-full object-cover flex-shrink-0" />
          <img src="/images/slider4.jpg" className="w-full h-full object-cover flex-shrink-0" />
          </div>


          <div className="absolute inset-0 bg-black/40"></div>


          <div className="relative text-center text-white px-6 max-w-3xl mx-auto top-1/2 -translate-y-1/2">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Welcome To Ceylon Places</h1>
          <p className="text-lg md:text-xl mb-6 drop-shadow-md">Find the best destinations, experiences, and travel guides all in one place.</p>
          </div>
          </section>

      {/* FEATURED SECTION */}
      <section className="py-16 px-6 md:px-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Top Destinations</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[
            { title: "Adam's Peak", image: "/images/Adam's Peak.jpeg" },
            { title: "Sigiriya", image: "/images/Sigiriya.jpeg" },
            { title: "Temple Of Tooth", image: "/images/TempleOfTooth.jpeg" },
          ].map((place, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-[1.03] transition transform cursor-pointer">
              <img src={place.image} alt={place.title} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{place.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-6 text-center bg-blue-900 text-white mt-16">
        <p>Ceylon Places © {new Date().getFullYear()} — All Rights Reserved</p>
      </footer>
    </div>
  );
}

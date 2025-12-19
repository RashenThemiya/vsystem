import { useState, useRef, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full relative">
      
      {/* TOP CONTACT BAR */}
      <div className="bg-[#3b1d5f] text-white text-sm py-2">
        <div className="max-w-7xl mx-auto flex justify-between px-6">
          <span>📞 Call Us: +94 11 209 3936</span>
          <span>✉️ Email: info@ceylonplaces.com</span>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="absolute top-10 w-full z-20 px-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md rounded-md shadow-md">

          {/* LOGO */}
          <div className="leading-tight">
            <h1 className="text-3xl font-serif tracking-wide font-semibold">
              CEYLON PLACES
            </h1>
            <p className="text-sm font-semibold tracking-widest text-gray-700">
              Sri Lanka
            </p>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="relative flex items-center gap-4" ref={menuRef}>
            
            {/* LOGIN BUTTON */}
            <button
              onClick={() => navigate("/login")}
              class="text-white bg-[#7800d0] hover:bg-[#7800d0]/90 focus:ring-4 
              focus:outline-none border rounded-xl
              border-transparent font-medium leading-5 rounded-base text-sm 
              px-3 py-2.5 text-center inline-flex items-center"    
            >
              Login
            </button>

            {/* MENU ICON */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-purple-300 transition"
            >
              <Bars3Icon className="h-7 w-7 text-purple-800" />
            </button>

            {/* DROPDOWN MENU */}
            {menuOpen && (
              <div className="absolute right-0 top-14 w-48 bg-white  shadow-lg overflow-hidden ">
                <button
                  onClick={() => {
                    navigate("/vehicles");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-purple-50"
                >
                  Vehicles
                </button>

                <button
                  onClick={() => {
                    navigate("/contact");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-purple-50"
                >
                  Contact Us
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}

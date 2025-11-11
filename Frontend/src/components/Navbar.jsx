import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { i18n } = useTranslation();
    const location = useLocation();

    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
    };

    const getTitle = () => {
        switch (i18n.language) {
            case 'en':
                return 'EduSmart Learning Platform';
            case 'ta':
                return 'எடுஸ்மார்ட் கல்வி மேடை';
            default:
                return 'එඩුස්මාට් අධ්‍යාපන වේදිකාව';
        }
    };

    const navLinkClass = (path) => {
        const isExactMatch = location.pathname === path;
        return `
            px-4 py-2 rounded-md font-medium transition duration-200 
            ${isExactMatch
                ? "bg-blue-500 text-white shadow-md"
                : "text-blue-100 hover:bg-blue-600 hover:text-white"
            }
        `;
    };

    return (
        <div className="sticky top-0 z-50 text-base md:text-lg bg-white shadow-md">
            {/* Top ribbon */}
            <div className="bg-blue-100 text-blue-900 text-sm md:text-base py-2 px-4 flex justify-between items-center font-medium">
                <div>
                    📘 Edu Support: <span className="font-semibold">
                        0764233731
                    </span>
                </div>
                <div className="space-x-4 flex">
                    <button onClick={() => handleLanguageChange('en')} className="hover:underline">EN</button>
                    <button onClick={() => handleLanguageChange('si')} className="hover:underline">සිං</button>
                    <button onClick={() => handleLanguageChange('ta')} className="hover:underline">தமிழ்</button>
                </div>
            </div>

            {/* Navbar */}
            <nav className="bg-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo & title */}
                    <div className="flex items-center space-x-4">
                        <img
                            src="/images/logo.png"
                            alt="Edu Logo"
                            className="w-12 h-12 rounded-md border border-white"
                        />
                        <Link to="/" className="text-2xl font-bold tracking-wide text-white leading-tight">
                            {getTitle()}
                        </Link>
                    </div>

                    {/* Desktop menu */}
                    <div className="hidden md:flex space-x-4 items-center">
                        <Link to="/" className={navLinkClass("/")}>Home</Link>
                        <Link to="/videos" className={navLinkClass("/videos")}>Videos</Link>
                        <Link to="/classes" className={navLinkClass("/classes")}>Classes</Link>
                        <Link to="/papers" className={navLinkClass("/papers")}>Papers</Link>
                        <Link to="/books" className={navLinkClass("/books")}>Books</Link>
                    </div>

                    {/* Mobile toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden px-4 pb-4 space-y-2 font-medium text-white text-base">
                        <Link to="/" className={navLinkClass("/")}>Home</Link>
                        <Link to="/videos" className={navLinkClass("/videos")}>Videos</Link>
                        <Link to="/classes" className={navLinkClass("/classes")}>Classes</Link>
                        <Link to="/papers" className={navLinkClass("/papers")}>Papers</Link>
                        <Link to="/books" className={navLinkClass("/books")}>Books</Link>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full h-20 px-8 fixed top-0 left-0 z-20 flex items-center shadow-lg bg-white text-gray-800">
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-2xl font-extrabold tracking-wide flex items-center gap-2">
          <span className="text-[#6a4dfa]">Bookmark Finder</span>
        </div>

        {/* Navigation Section */}
        <nav className="hidden md:flex gap-6 text-lg">
          <Link to="/" className="hover:text-[#6a4dfa] transition-colors duration-300 text-gray-700">
            Home
          </Link>
          <Link to="/about" className="hover:text-[#6a4dfa] transition-colors duration-300 text-gray-700">
            About
          </Link>
          <Link to="/contact" className="hover:text-[#6a4dfa] transition-colors duration-300 text-gray-700">
            Contact
          </Link>
        </nav>

        {/* Actions Section */}
        <div className="flex items-center gap-4">
          {/* Login/Sign Up Buttons */}
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition duration-300 bg-[#6a4dfa] text-white hover:bg-[#4b3ac8]"
          >
            Login
          </Link>
          <Link
            to="/"
            className="px-5 py-2 rounded-lg text-sm font-medium border transition duration-300 border-[#6a4dfa] text-[#6a4dfa] hover:bg-[#6a4dfa] hover:text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons'; // Social Media Icons
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-6 bg-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Description */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h1 className="text-2xl font-extrabold tracking-wide">
            <span className="text-[#6a4dfa]">TradingTick</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Empowering your trading journey with insights and tools.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-6 justify-center md:justify-start text-lg">
          <Link
            to="/"
            className="hover:text-[#6a4dfa] transition-colors duration-300 text-gray-700"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-[#6a4dfa] transition-colors duration-300 text-gray-700"
          >
            About
          </Link>
          <Link
            to="/signup"
            className="hover:text-[#6a4dfa] transition-colors duration-300 text-gray-700"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="hover:text-[#6a4dfa] transition-colors duration-300 text-gray-700"
          >
            Login
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4 mt-6 md:mt-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 text-gray-600 hover:text-[#6a4dfa]"
          >
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 text-gray-600 hover:text-[#6a4dfa]"
          >
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 text-gray-600 hover:text-[#6a4dfa]"
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 text-gray-600 hover:text-[#6a4dfa]"
          >
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-8 pt-4 text-center border-t border-gray-300 text-gray-600">
        © {new Date().getFullYear()} TradingTick. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

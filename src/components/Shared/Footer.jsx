import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-gray-300 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding */}
        <div className="text-lg font-semibold">Ideal11 © {new Date().getFullYear()}</div>

        {/* Links */}
        <div className="flex space-x-6 text-sm">
          <a href="/terms" className="hover:text-white transition">Terms</a>
          <a href="/privacy" className="hover:text-white transition">Privacy</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
        </div>

        {/* Social */}
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition">
            <FaFacebook size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-sky-400 transition">
            <FaTwitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

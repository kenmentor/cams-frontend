import Link from "next/link";
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1C1C1E] text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section - Branding */}
        <div>
          <h2 className="text-2xl font-bold text-white">CampusPulse</h2>
          <p className="mt-2 text-sm text-gray-400">
            Find the perfect event or apartment without stress.
          </p>
        </div>

        {/* Center Section - Quick Links */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/" className="hover:text-[#0A84FF] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-[#0A84FF] transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/homepage"
                className="hover:text-[#0A84FF] transition-colors"
              >
                Resources
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-[#0A84FF] transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section - Socials */}
        <div className="text-center md:text-right">
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="mt-3 flex justify-center md:justify-end gap-4">
            <Link
              href="#"
              className="p-3 rounded-full bg-gray-800 hover:bg-blue-600 hover:text-white transition-all"
            >
              <FaFacebookF />
            </Link>
            <Link
              href="#"
              className="p-3 rounded-full bg-gray-800 hover:bg-blue-400 hover:text-white transition-all"
            >
              <FaTwitter />
            </Link>
            <Link
              href="#"
              className="p-3 rounded-full bg-gray-800 hover:bg-pink-500 hover:text-white transition-all"
            >
              <FaInstagram />
            </Link>
            <Link
              href="#"
              className="p-3 rounded-full bg-gray-800 hover:bg-blue-700 hover:text-white transition-all"
            >
              <FaLinkedinIn />
            </Link>
            <Link
              href="#"
              className="p-3 rounded-full bg-gray-800 hover:bg-black hover:text-white transition-all"
            >
              <FaTiktok />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-sm text-gray-500 mt-8 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} CampusPulse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

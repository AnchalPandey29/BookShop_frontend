import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookHeart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Find Books", path: "/books" },
    { label: "Sell Books", path: "/sell" },
    { label: "My Orders", path: "/orders" },
    
    { label: "Contact", path: "/contact" },
  ];

  // Prevent background scroll when menu is open (mobile UX improvement)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <BookHeart className="text-yellow-500 w-7 h-7" />
          <span className="text-2xl font-bold text-gray-800">
            Book
            <span className="text-yellow-500">Share</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menu.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-gray-700 font-medium hover:text-yellow-500 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/login"
            className="bg-yellow-400 text-black px-5 py-2 rounded-2xl font-semibold hover:bg-yellow-300 transition"
          >
            Login / Signup
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu (Animated) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } bg-white border-t border-gray-100 shadow-inner`}
      >
        <div className="flex flex-col items-center py-4 space-y-4">
          {menu.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-gray-700 font-medium hover:text-yellow-500 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/login"
            className="bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
            onClick={() => setIsOpen(false)}
          >
            Login / Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

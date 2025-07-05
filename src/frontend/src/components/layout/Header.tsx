import React from "react";
import { Link } from "react-router-dom";
import { Home, LayoutDashboard, Users } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-opacity-50 sticky top-0 z-50 bg-gray-900 text-white shadow-lg backdrop-blur-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-3">
        <Link
          to="/"
          className="text-2xl font-bold text-cyan-400 transition-colors duration-300 hover:text-cyan-300"
        >
          PoPAI
        </Link>
        <div className="space-x-4">
          <Link
            to="/"
            className="flex items-center transition-colors duration-300 hover:text-cyan-400"
          >
            <Home size={18} className="mr-1" /> Home
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center transition-colors duration-300 hover:text-cyan-400"
          >
            <LayoutDashboard size={18} className="mr-1" /> Dev Dashboard
          </Link>
          <Link
            to="/dao-reputation"
            className="flex items-center transition-colors duration-300 hover:text-cyan-400"
          >
            <Users size={18} className="mr-1" /> DAO Panel
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

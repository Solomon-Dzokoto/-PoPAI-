import React from 'react';
import { Link } from 'react-router-dom';
import { Home,  LayoutDashboard, Users } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 bg-opacity-50 backdrop-blur-md text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
          PoPAI
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-cyan-400 transition-colors duration-300 flex items-center">
            <Home size={18} className="mr-1" /> Home
          </Link>
          <Link to="/dashboard" className="hover:text-cyan-400 transition-colors duration-300 flex items-center">
            <LayoutDashboard size={18} className="mr-1" /> Dev Dashboard
          </Link>
          <Link to="/dao-reputation" className="hover:text-cyan-400 transition-colors duration-300 flex items-center">
            <Users size={18} className="mr-1" /> DAO Panel
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;

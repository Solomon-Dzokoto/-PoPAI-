import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 bg-opacity-50 backdrop-blur-md text-gray-400 py-6 mt-auto">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} PoPAI. All rights reserved.</p>
        <p className="text-sm">Privacy-Preserving Proof-of-Personhood</p>
      </div>
    </footer>
  );
};

export default Footer;

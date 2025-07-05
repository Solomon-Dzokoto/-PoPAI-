import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-opacity-50 mt-auto bg-gray-900 py-6 text-gray-400 backdrop-blur-md">
      <div className="container mx-auto px-6 text-center">
        <p>&copy; {new Date().getFullYear()} PoPAI. All rights reserved.</p>
        <p className="text-sm">Privacy-Preserving Proof-of-Personhood</p>
      </div>
    </footer>
  );
};

export default Footer;

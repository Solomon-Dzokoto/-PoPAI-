import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Download } from 'lucide-react';

const SuccessPage: React.FC = () => {
  // Mock NFT data
  const nftData = {
    name: "PoPAI Verified Human",
    id: "POP-XYZ-123",
    issuedDate: new Date().toLocaleDateString(),
    issuer: "PoPAI Protocol",
    verificationHash: "0xabc123def456...", // Mocked hash
  };

  const downloadBadge = () => {
    // Simulate downloading a badge image or certificate
    const element = document.createElement("a");
    const file = new Blob(
      [`PoPAI Verified Human Badge\nID: ${nftData.id}\nIssued: ${nftData.issuedDate}\nVerification Hash: ${nftData.verificationHash}`],
      {type: 'text/plain'}
    );
    element.href = URL.createObjectURL(file);
    element.download = "PoPAI_Verified_Badge.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)] p-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      <motion.div
        className="p-8 md:p-12 bg-gray-800 bg-opacity-70 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-500/50 max-w-lg w-full"
        whileHover={{ scale: 1.02, boxShadow: "0px 0px 30px rgba(0, 255, 150, 0.5)" }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 150 }}
        >
          <Award size={80} className="mx-auto text-green-400" style={{ filter: 'drop-shadow(0 0 10px #0F0)' }} />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span
            style={{
              background: 'linear-gradient(to right, #00FF7F, #32CD32)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Verification Successful!
          </span>
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Congratulations! You've successfully proven your personhood.
        </p>

        <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg mb-8 text-left space-y-3 border border-gray-600">
          <h3 className="text-xl font-semibold text-green-300 mb-3 flex items-center">
            <ShieldCheck size={22} className="mr-2" /> Your Soulbound NFT Badge
          </h3>
          <p><strong>Name:</strong> {nftData.name}</p>
          <p><strong>Token ID (mock):</strong> <span className="font-mono text-sm">{nftData.id}</span></p>
          <p><strong>Issued Date:</strong> {nftData.issuedDate}</p>
          <p><strong>Verification Hash (mock):</strong> <span className="font-mono text-xs">{nftData.verificationHash}</span></p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            onClick={downloadBadge}
            className="flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-400 text-gray-900 font-semibold rounded-lg shadow-md hover:shadow-green-500/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={20} className="mr-2" /> Download Badge Info
          </motion.button>
          <Link
            to="/dashboard"
            className="flex items-center justify-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:shadow-cyan-500/40 transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </div>
         <p className="text-xs text-gray-500 mt-6">
           Note: This is a simulated NFT. Full on-chain NFT minting will be implemented soon.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SuccessPage;

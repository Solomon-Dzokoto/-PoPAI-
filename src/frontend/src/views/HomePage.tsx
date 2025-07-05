import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
        className="p-8 md:p-12 bg-gray-800 bg-opacity-60 backdrop-blur-lg rounded-xl shadow-2xl border border-cyan-500/30"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{
            background: 'linear-gradient(to right, #00FFFF, #FF00FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to PoPAI
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The future of decentralized identity. Verify your personhood securely and privately on the Internet Computer.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            to="/challenge"
            className="inline-flex items-center justify-center px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 text-lg"
          >
            <ShieldCheck size={24} className="mr-3" />
            Start Verification
            <Zap size={24} className="ml-3" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-16 grid md:grid-cols-3 gap-8 text-left max-w-5xl w-full"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.8,
            }
          }
        }}
      >
        {[
          { title: "Privacy First", description: "Homomorphic encryption and ZK-proofs ensure your data remains yours.", icon: "🔒" },
          { title: "Fully On-Chain", description: "AI logic runs inside ICP canisters for true decentralization.", icon: "🔗" },
          { title: "Soulbound NFTs", description: "Receive a non-transferable token as proof of your unique personhood.", icon: "🎨" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="p-6 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-lg shadow-xl border border-purple-500/30"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-purple-400 mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HomePage;

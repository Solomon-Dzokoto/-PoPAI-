import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Zap } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
        className="bg-opacity-60 rounded-xl border border-cyan-500/30 bg-gray-800 p-8 shadow-2xl backdrop-blur-lg md:p-12"
      >
        <motion.h1
          className="mb-6 text-5xl font-bold md:text-7xl"
          style={{
            background: "linear-gradient(to right, #00FFFF, #FF00FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to PoPAI
        </motion.h1>
        <motion.p
          className="mb-10 max-w-2xl text-lg text-gray-300 md:text-xl"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          The future of decentralized identity. Verify your personhood securely
          and privately on the Internet Computer.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            to="/challenge"
            className="inline-flex transform items-center justify-center rounded-lg bg-cyan-500 px-8 py-4 text-lg font-semibold text-gray-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-cyan-400 hover:shadow-cyan-500/50"
          >
            <ShieldCheck size={24} className="mr-3" />
            Start Verification
            <Zap size={24} className="ml-3" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-16 grid w-full max-w-5xl gap-8 text-left md:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.8,
            },
          },
        }}
      >
        {[
          {
            title: "Privacy First",
            description:
              "Homomorphic encryption and ZK-proofs ensure your data remains yours.",
            icon: "🔒",
          },
          {
            title: "Fully On-Chain",
            description:
              "AI logic runs inside ICP canisters for true decentralization.",
            icon: "🔗",
          },
          {
            title: "Soulbound NFTs",
            description:
              "Receive a non-transferable token as proof of your unique personhood.",
            icon: "🎨",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="bg-opacity-70 rounded-lg border border-purple-500/30 bg-gray-800 p-6 shadow-xl backdrop-blur-md"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
          >
            <div className="mb-3 text-3xl">{feature.icon}</div>
            <h3 className="mb-2 text-xl font-semibold text-purple-400">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HomePage;

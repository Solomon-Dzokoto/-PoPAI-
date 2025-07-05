import React from "react";
import { motion } from "framer-motion";
import { Users, CheckSquare, ShieldAlert, Award } from "lucide-react";

// Mock data for DAO members and their PoPAI status
const mockMembers = [
  {
    id: "1",
    name: "Alice (DAO Core)",
    popaiVerified: true,
    reputation: 1200,
    avatar: "🤖",
  },
  {
    id: "2",
    name: "Bob (Community Mod)",
    popaiVerified: true,
    reputation: 850,
    avatar: "🧑‍🚀",
  },
  {
    id: "3",
    name: "Carol (New Member)",
    popaiVerified: false,
    reputation: 50,
    avatar: "🧑‍🎨",
  },
  {
    id: "4",
    name: "Dave (Contributor)",
    popaiVerified: true,
    reputation: 950,
    avatar: "🧑‍💻",
  },
  {
    id: "5",
    name: "Eve (Applicant)",
    popaiVerified: null,
    reputation: 0,
    avatar: "🧐",
  }, // Null for pending/unknown
];

const DaoReputationPage: React.FC = () => {
  return (
    <motion.div
      className="p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-8 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-center text-4xl font-bold text-transparent">
        DAO Reputation Panel (Mock)
      </h1>

      <p className="mx-auto mb-10 max-w-2xl text-center text-gray-400">
        Illustrates how DAOs can integrate PoPAI to gate membership, voting, or
        enhance trust. This panel shows hypothetical DAO members and their PoPAI
        verification status.
      </p>

      <div className="bg-opacity-70 overflow-hidden rounded-xl border border-sky-500/30 bg-gray-800 shadow-2xl backdrop-blur-xl">
        <div className="border-b border-gray-700 p-6">
          <h2 className="flex items-center text-2xl font-semibold text-sky-300">
            <Users size={28} className="mr-3" /> Member Verification Status
          </h2>
        </div>

        <div className="divide-y divide-gray-700">
          {mockMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="flex flex-col items-center justify-between p-4 transition-colors duration-200 hover:bg-gray-700/30 sm:flex-row md:p-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="mb-3 flex items-center sm:mb-0">
                <span className="mr-4 text-3xl">{member.avatar}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Reputation: {member.reputation} pts
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {member.popaiVerified === true && (
                  <span className="flex items-center rounded-full border border-green-500 bg-green-600/30 px-3 py-1 text-xs text-green-300 sm:text-sm">
                    <CheckSquare size={16} className="mr-1.5" /> PoPAI Verified
                  </span>
                )}
                {member.popaiVerified === false && (
                  <span className="flex items-center rounded-full border border-red-500 bg-red-600/30 px-3 py-1 text-xs text-red-300 sm:text-sm">
                    <ShieldAlert size={16} className="mr-1.5" /> Not Verified
                  </span>
                )}
                {member.popaiVerified === null && (
                  <span className="flex items-center rounded-full border border-yellow-500 bg-yellow-600/30 px-3 py-1 text-xs text-yellow-300 sm:text-sm">
                    <Award size={16} className="mr-1.5" /> Pending Verification
                  </span>
                )}
                <button className="rounded-md bg-sky-600 px-3 py-1.5 text-xs text-white transition-colors duration-200 hover:bg-sky-500">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="border-t border-gray-700 p-4 text-center text-xs text-gray-500">
          This data is for demonstration purposes only.
        </div>
      </div>

      <motion.div
        className="bg-opacity-50 mt-10 rounded-lg border border-gray-700/50 bg-gray-800 p-6 text-center shadow-lg backdrop-blur-sm"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: mockMembers.length * 0.1 + 0.2, duration: 0.5 }}
      >
        <h3 className="mb-2 text-xl font-semibold text-gray-300">
          Social Attestation Layer (Concept)
        </h3>
        <p className="mx-auto max-w-xl text-sm text-gray-400">
          Future enhancement: DAOs could "attest" to verified PoPAI users,
          adding layers of reputation and trust within specific communities.
          This could influence governance rights or access to special roles.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default DaoReputationPage;

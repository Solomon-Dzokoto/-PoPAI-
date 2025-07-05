import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckSquare, ShieldAlert, Award } from 'lucide-react';

// Mock data for DAO members and their PoPAI status
const mockMembers = [
  { id: '1', name: 'Alice (DAO Core)', popaiVerified: true, reputation: 1200, avatar: '🤖' },
  { id: '2', name: 'Bob (Community Mod)', popaiVerified: true, reputation: 850, avatar: '🧑‍🚀' },
  { id: '3', name: 'Carol (New Member)', popaiVerified: false, reputation: 50, avatar: '🧑‍🎨' },
  { id: '4', name: 'Dave (Contributor)', popaiVerified: true, reputation: 950, avatar: '🧑‍💻' },
  { id: '5', name: 'Eve (Applicant)', popaiVerified: null, reputation: 0, avatar: '🧐' }, // Null for pending/unknown
];

const DaoReputationPage: React.FC = () => {
  return (
    <motion.div
      className="p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
        DAO Reputation Panel (Mock)
      </h1>

      <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
        Illustrates how DAOs can integrate PoPAI to gate membership, voting, or enhance trust.
        This panel shows hypothetical DAO members and their PoPAI verification status.
      </p>

      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-xl rounded-xl shadow-2xl border border-sky-500/30 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-sky-300 flex items-center">
            <Users size={28} className="mr-3" /> Member Verification Status
          </h2>
        </div>

        <div className="divide-y divide-gray-700">
          {mockMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between hover:bg-gray-700/30 transition-colors duration-200"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="flex items-center mb-3 sm:mb-0">
                <span className="text-3xl mr-4">{member.avatar}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">{member.name}</h3>
                  <p className="text-sm text-gray-400">Reputation: {member.reputation} pts</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {member.popaiVerified === true && (
                  <span className="flex items-center text-xs sm:text-sm px-3 py-1 bg-green-600/30 text-green-300 rounded-full border border-green-500">
                    <CheckSquare size={16} className="mr-1.5" /> PoPAI Verified
                  </span>
                )}
                {member.popaiVerified === false && (
                  <span className="flex items-center text-xs sm:text-sm px-3 py-1 bg-red-600/30 text-red-300 rounded-full border border-red-500">
                    <ShieldAlert size={16} className="mr-1.5" /> Not Verified
                  </span>
                )}
                {member.popaiVerified === null && (
                  <span className="flex items-center text-xs sm:text-sm px-3 py-1 bg-yellow-600/30 text-yellow-300 rounded-full border border-yellow-500">
                    <Award size={16} className="mr-1.5" /> Pending Verification
                  </span>
                )}
                <button className="text-xs px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors duration-200">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-700">
          This data is for demonstration purposes only.
        </div>
      </div>

      <motion.div
        className="mt-10 p-6 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: mockMembers.length * 0.1 + 0.2, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-gray-300 mb-2">Social Attestation Layer (Concept)</h3>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Future enhancement: DAOs could "attest" to verified PoPAI users, adding layers of reputation
          and trust within specific communities. This could influence governance rights or access to special roles.
        </p>
      </motion.div>

    </motion.div>
  );
};

export default DaoReputationPage;

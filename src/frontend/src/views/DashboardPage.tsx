import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Code,  Settings } from 'lucide-react';

const CodeBlock: React.FC<{ children: string; language?: string }> = ({ children, language = 'javascript' }) => (
  <pre className={`bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700 text-sm font-mono text-cyan-300`}>
    <code className={`language-${language}`}>{children.trim()}</code>
  </pre>
);

const DashboardPage: React.FC = () => {
  const sdkUsageExample = `
import { PopaiSDK } from 'popai-sdk'; // Fictional SDK

const popai = new PopaiSDK({ apiKey: 'YOUR_API_KEY' }); // Or canister ID

async function handleVerification() {
  try {
    const result = await popai.startVerification();
    if (result.isVerified) {
      console.log('User is verified!', result.nftId);
      // Store result.nftId or use it to gate access
    } else {
      console.log('Verification failed:', result.error);
    }
  } catch (error) {
    console.error('SDK Error:', error);
  }
}

// Call this when user clicks your verification button
// handleVerification();
  `;

  const contractIntegrationExample = `
// Solidity Example
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract MyDApp {
    IERC721 popaiNftContract; // Address of PoPAI NFT contract

    constructor(address _popaiNftAddress) {
        popaiNftContract = IERC721(_popaiNftAddress);
    }

    function isUserVerified(address user) public view returns (bool) {
        // This is a simplified check. Real check might involve specific token IDs or attributes.
        return popaiNftContract.balanceOf(user) > 0;
    }

    function protectedAction() public {
        require(isUserVerified(msg.sender), "User must be PoPAI verified");
        // ... proceed with action for verified users
    }
}
  `;

  return (
    <motion.div
      className="p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        Developer Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* SDK Usage Section */}
        <motion.section
          className="bg-gray-800 bg-opacity-60 backdrop-blur-md p-6 rounded-xl shadow-xl border border-purple-500/30"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-purple-400 flex items-center">
            <Code size={28} className="mr-3" /> SDK Integration (Mock)
          </h2>
          <p className="text-gray-400 mb-4">
            Easily integrate PoPAI into your dApp with our JavaScript SDK.
          </p>
          <CodeBlock language="javascript">{sdkUsageExample}</CodeBlock>
          <p className="text-xs text-gray-500 mt-3">
            Note: This SDK is conceptual and for demonstration purposes.
          </p>
        </motion.section>

        {/* Smart Contract Verifier Section */}
        <motion.section
          className="bg-gray-800 bg-opacity-60 backdrop-blur-md p-6 rounded-xl shadow-xl border border-pink-500/30"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-pink-400 flex items-center">
            <Terminal size={28} className="mr-3" /> Smart Contract Verifier (Mock)
          </h2>
          <p className="text-gray-400 mb-4">
            Verify user's PoPAI status directly in your smart contracts.
          </p>
          <CodeBlock language="solidity">{contractIntegrationExample}</CodeBlock>
           <p className="text-xs text-gray-500 mt-3">
            Example for EVM chains. ICP canister interaction would use Candid.
          </p>
        </motion.section>
      </div>

      {/* Placeholder for future sections */}
      <motion.section
        className="mt-12 p-6 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-3 text-gray-300 flex items-center">
          <Settings size={24} className="mr-2" /> Future Features
        </h2>
        <ul className="list-disc list-inside text-gray-400 space-y-1">
          <li>Real-time verification analytics</li>
          <li>API key management</li>
          <li>Customizable challenge settings</li>
          <li>Documentation portal</li>
        </ul>
      </motion.section>
    </motion.div>
  );
};

export default DashboardPage;

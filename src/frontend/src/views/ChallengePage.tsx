import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

// Mock challenges
const challenges = [
  { id: 'blink', text: 'Blink twice', duration: 5 },
  { id: 'nod', text: 'Nod your head', duration: 5 },
  { id: 'say_phrase', text: 'Say "PoPAI is cool"', duration: 7, requiresMic: true },
  { id: 'turn_left', text: 'Turn head to the left', duration: 5 },
];

const ChallengePage: React.FC = () => {
  const navigate = useNavigate();
  const [hasWebcamAccess, setHasWebcamAccess] = useState<boolean | null>(null);
  const [hasMicAccess, setHasMicAccess] = useState<boolean | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<(typeof challenges)[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Attempt to get webcam access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => setHasWebcamAccess(true))
      .catch(() => setHasWebcamAccess(false));

    // Optionally attempt to get mic access
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasMicAccess(true))
      .catch(() => setHasMicAccess(false));
  }, []);

  useEffect(() => {
    if (currentChallenge) {
      setCountdown(currentChallenge.duration);
    }
  }, [currentChallenge]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && currentChallenge && verificationStatus === 'pending') {
      // Simulate verification process
      setIsLoading(true);
      setTimeout(() => {
        // Mock success/failure
        const isSuccess = Math.random() > 0.3; // 70% chance of success
        setVerificationStatus(isSuccess ? 'success' : 'failed');
        setIsLoading(false);
        if (isSuccess) {
          setTimeout(() => navigate('/success'), 2000);
        }
      }, 2000); // Simulate network delay and AI processing
    }
  }, [countdown, currentChallenge, verificationStatus, navigate]);

  const startRandomChallenge = () => {
    if (hasWebcamAccess === false) return; // Cannot start without webcam

    // Filter challenges that might require mic if mic access is not granted
    const availableChallenges = currentChallenge?.requiresMic && !hasMicAccess
        ? challenges.filter(c => !c.requiresMic)
        : challenges;

    const randomIndex = Math.floor(Math.random() * availableChallenges.length);
    const newChallenge = availableChallenges[randomIndex];

    // Ensure mic is available if challenge requires it
    if (newChallenge.requiresMic && !hasMicAccess) {
        alert("This challenge requires microphone access, but it was not granted or is unavailable. Please try a different challenge or grant microphone access.");
        setVerificationStatus(null); // Reset status to allow retry
        setCurrentChallenge(null);
        return;
    }

    setCurrentChallenge(newChallenge);
    setVerificationStatus('pending');
    setIsLoading(false);
  };

  const resetChallenge = () => {
    setCurrentChallenge(null);
    setVerificationStatus(null);
    setIsLoading(false);
    setCountdown(0);
  };

  if (hasWebcamAccess === null) {
    return <div className="text-center p-10">Checking camera permissions... <RefreshCw className="animate-spin inline-block" /></div>;
  }

  if (hasWebcamAccess === false) {
    return (
      <div className="text-center p-10 bg-red-800 bg-opacity-50 backdrop-blur-md rounded-lg shadow-xl border border-red-500/50">
        <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
        <h2 className="text-2xl font-semibold mb-2">Webcam Access Denied</h2>
        <p className="text-red-300">PoPAI requires webcam access to perform liveness checks. Please grant permission in your browser settings.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-2xl bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-xl shadow-2xl border border-cyan-500/30 p-6 md:p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-cyan-400">Verification Challenge</h2>

        {/* Webcam feed placeholder */}
        <div className="w-full aspect-video bg-gray-900 rounded-md mb-6 flex items-center justify-center border border-gray-700">
          {currentChallenge ? (
            <Camera size={64} className="text-gray-600" />
          ) : (
            <p className="text-gray-500">Webcam feed will appear here</p>
          )}
        </div>

        {/* Mic status indicator */}
        {currentChallenge?.requiresMic && (
            <div className={`mb-4 text-sm flex items-center justify-center ${hasMicAccess ? 'text-green-400' : 'text-red-400'}`}>
                <Mic size={16} className="mr-2" />
                {hasMicAccess ? 'Microphone active' : 'Microphone access denied or unavailable'}
            </div>
        )}

        <AnimatePresence mode="wait">
          {!currentChallenge && !verificationStatus && (
            <motion.button
              key="start"
              onClick={startRandomChallenge}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 text-lg flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Zap size={20} className="mr-2" /> Start Challenge
            </motion.button>
          )}

          {currentChallenge && verificationStatus === 'pending' && (
            <motion.div
              key="challenge"
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <p className="text-xl md:text-2xl font-semibold text-yellow-400 mb-2">Challenge: {currentChallenge.text}</p>
              <p className="text-4xl md:text-6xl font-bold text-cyan-300 mb-4">{countdown}</p>
              {isLoading && <p className="text-lg text-gray-400 flex items-center justify-center"><RefreshCw className="animate-spin mr-2" /> Verifying...</p>}
            </motion.div>
          )}

          {verificationStatus === 'success' && (
            <motion.div
              key="success"
              className="text-center p-6 bg-green-700 bg-opacity-80 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle size={48} className="mx-auto mb-3 text-green-300" />
              <p className="text-2xl font-semibold text-white">Verification Successful!</p>
              <p className="text-green-200">Redirecting you...</p>
            </motion.div>
          )}

          {verificationStatus === 'failed' && (
            <motion.div
              key="failed"
              className="text-center p-6 bg-red-700 bg-opacity-80 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertTriangle size={48} className="mx-auto mb-3 text-red-300" />
              <p className="text-2xl font-semibold text-white">Verification Failed</p>
              <p className="text-red-200 mb-4">Please try again. Ensure good lighting and follow the prompt carefully.</p>
              <button
                onClick={resetChallenge}
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-lg shadow hover:shadow-yellow-500/40 transition-colors duration-300"
              >
                <RefreshCw size={18} className="mr-2 inline-block" /> Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChallengePage;

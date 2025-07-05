import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mic,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap,
} from "lucide-react";
import { backendService } from "../services/backendService";

// Mock challenges
const challenges = [
  { id: "blink", text: "Blink twice", duration: 5 },
  { id: "nod", text: "Nod your head", duration: 5 },
  {
    id: "say_phrase",
    text: 'Say "PoPAI is cool"',
    duration: 7,
    requiresMic: true,
  },
  { id: "turn_left", text: "Turn head to the left", duration: 5 },
];
console.log("🚀 ~ challenges:", challenges);

const ChallengePage: React.FC = () => {
  const navigate = useNavigate();
  const [hasWebcamAccess, setHasWebcamAccess] = useState<boolean | null>(null);
  const [hasMicAccess, setHasMicAccess] = useState<boolean | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "failed" | null
  >(null);
  const [countdown, setCountdown] = useState(0);
  const [backendChallenge, setBackendChallenge] = useState<any>(null);

  useEffect(() => {
    // Attempt to get webcam access
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setHasWebcamAccess(true))
      .catch(() => setHasWebcamAccess(false));

    // Optionally attempt to get mic access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
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
    } else if (
      countdown === 0 &&
      currentChallenge &&
      verificationStatus === "pending" &&
      backendChallenge
    ) {
      // Submit challenge result to backend
      setIsLoading(true);

      const submitChallenge = async () => {
        try {
          // Create mock submission data
          const mockData =
            currentChallenge.id === "Blink"
              ? "blinked"
              : currentChallenge.id === "Nod"
                ? "nodded"
                : currentChallenge.id === "SayPhrase"
                  ? "said_phrase"
                  : "completed";

          const submission = {
            challenge_id: backendChallenge.id,
            mock_data: mockData,
            client_timestamp: BigInt(Date.now()),
            encrypted_biometric_data: new Uint8Array([1, 2, 3, 4]), // Mock biometric data
            behavioral_data: JSON.stringify({
              mouse_movements: [],
              reaction_time: 500,
            }), // Mock behavioral data
          };

          const result = await backendService.submitChallengeResult(submission);

          setVerificationStatus(result.success ? "success" : "failed");
          setIsLoading(false);

          if (result.success) {
            setTimeout(() => navigate("/success"), 2000);
          }
        } catch (error) {
          console.error("Failed to submit challenge:", error);
          setVerificationStatus("failed");
          setIsLoading(false);
        }
      };

      submitChallenge();
    }
  }, [
    countdown,
    currentChallenge,
    verificationStatus,
    backendChallenge,
    navigate,
  ]);

  const startRandomChallenge = async () => {
    if (hasWebcamAccess === false) return; // Cannot start without webcam

    try {
      setIsLoading(true);
      // Get a challenge from the backend
      const challenge = await backendService.startVerificationChallenge();
      setBackendChallenge(challenge);

      // Map backend challenge to frontend format
      const frontendChallenge = {
        id: challenge.prompt_type,
        text: challenge.prompt_text,
        duration: challenge.prompt_type === "SayPhrase" ? 7 : 5,
        requiresMic: challenge.prompt_type === "SayPhrase",
      };

      // Ensure mic is available if challenge requires it
      if (frontendChallenge.requiresMic && !hasMicAccess) {
        alert(
          "This challenge requires microphone access, but it was not granted or is unavailable. Please try a different challenge or grant microphone access.",
        );
        setVerificationStatus(null); // Reset status to allow retry
        setCurrentChallenge(null);
        setIsLoading(false);
        return;
      }

      setCurrentChallenge(frontendChallenge);
      setVerificationStatus("pending");
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to start challenge:", error);
      setIsLoading(false);
      alert("Failed to start challenge. Please try again.");
    }
  };

  const resetChallenge = () => {
    setCurrentChallenge(null);
    setVerificationStatus(null);
    setIsLoading(false);
    setCountdown(0);
  };

  if (hasWebcamAccess === null) {
    return (
      <div className="p-10 text-center">
        Checking camera permissions...{" "}
        <RefreshCw className="inline-block animate-spin" />
      </div>
    );
  }

  if (hasWebcamAccess === false) {
    return (
      <div className="bg-opacity-50 rounded-lg border border-red-500/50 bg-red-800 p-10 text-center shadow-xl backdrop-blur-md">
        <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
        <h2 className="mb-2 text-2xl font-semibold">Webcam Access Denied</h2>
        <p className="text-red-300">
          PoPAI requires webcam access to perform liveness checks. Please grant
          permission in your browser settings.
        </p>
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
      <div className="bg-opacity-70 w-full max-w-2xl rounded-xl border border-cyan-500/30 bg-gray-800 p-6 shadow-2xl backdrop-blur-lg md:p-8">
        <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">
          Verification Challenge
        </h2>

        {/* Webcam feed placeholder */}
        <div className="mb-6 flex aspect-video w-full items-center justify-center rounded-md border border-gray-700 bg-gray-900">
          {currentChallenge ? (
            <Camera size={64} className="text-gray-600" />
          ) : (
            <p className="text-gray-500">Webcam feed will appear here</p>
          )}
        </div>

        {/* Mic status indicator */}
        {currentChallenge?.requiresMic && (
          <div
            className={`mb-4 flex items-center justify-center text-sm ${hasMicAccess ? "text-green-400" : "text-red-400"}`}
          >
            <Mic size={16} className="mr-2" />
            {hasMicAccess
              ? "Microphone active"
              : "Microphone access denied or unavailable"}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!currentChallenge && !verificationStatus && (
            <motion.button
              key="start"
              onClick={startRandomChallenge}
              className="flex w-full transform items-center justify-center rounded-lg bg-purple-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-purple-500 hover:shadow-purple-500/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Zap size={20} className="mr-2" /> Start Challenge
            </motion.button>
          )}

          {currentChallenge && verificationStatus === "pending" && (
            <motion.div
              key="challenge"
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <p className="mb-2 text-xl font-semibold text-yellow-400 md:text-2xl">
                Challenge: {currentChallenge.text}
              </p>
              <p className="mb-4 text-4xl font-bold text-cyan-300 md:text-6xl">
                {countdown}
              </p>
              {isLoading && (
                <p className="flex items-center justify-center text-lg text-gray-400">
                  <RefreshCw className="mr-2 animate-spin" /> Verifying...
                </p>
              )}
            </motion.div>
          )}

          {verificationStatus === "success" && (
            <motion.div
              key="success"
              className="bg-opacity-80 rounded-lg bg-green-700 p-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle size={48} className="mx-auto mb-3 text-green-300" />
              <p className="text-2xl font-semibold text-white">
                Verification Successful!
              </p>
              <p className="text-green-200">Redirecting you...</p>
            </motion.div>
          )}

          {verificationStatus === "failed" && (
            <motion.div
              key="failed"
              className="bg-opacity-80 rounded-lg bg-red-700 p-6 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertTriangle size={48} className="mx-auto mb-3 text-red-300" />
              <p className="text-2xl font-semibold text-white">
                Verification Failed
              </p>
              <p className="mb-4 text-red-200">
                Please try again. Ensure good lighting and follow the prompt
                carefully.
              </p>
              <button
                onClick={resetChallenge}
                className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-gray-900 shadow transition-colors duration-300 hover:bg-yellow-400 hover:shadow-yellow-500/40"
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

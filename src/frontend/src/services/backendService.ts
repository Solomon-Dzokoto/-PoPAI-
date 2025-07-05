import { backend } from "../../../declarations/backend";

/**
 * Service for handling all backend canister API calls
 */
export const backendService = {
  /**
   * Sends a greeting to the backend and returns the response
   * @param name Name to greet
   * @returns Promise with the greeting response
   */
  async greet(name: string): Promise<string> {
    return await backend.greet(name || "World");
  },

  /**
   * Fetches the current counter value
   * @returns Promise with the current count
   */
  async getCount(): Promise<bigint> {
    return await backend.get_count();
  },

  /**
   * Increments the counter on the backend
   * @returns Promise with the new count
   */
  async incrementCounter(): Promise<bigint> {
    return await backend.increment();
  },

  /**
   * Sends a prompt to the LLM backend
   * @param prompt The user's prompt text
   * @returns Promise with the LLM response
   */
  async sendLlmPrompt(prompt: string): Promise<string> {
    return await backend.prompt(prompt);
  },

  /**
   * Starts a new verification challenge
   * @returns Promise with the verification challenge details
   */
  async startVerificationChallenge(): Promise<any> {
    return await backend.start_verification_challenge();
  },

  /**
   * Submits a challenge result for verification
   * @param submission The verification submission data
   * @returns Promise with the verification result
   */
  async submitChallengeResult(submission: {
    challenge_id: string;
    mock_data: string;
    client_timestamp: bigint;
    encrypted_biometric_data: Uint8Array;
    behavioral_data: string;
  }): Promise<any> {
    return await backend.submit_challenge_result(submission);
  },

  /**
   * Gets NFT metadata by token ID
   * @param tokenId The NFT token ID
   * @returns Promise with NFT metadata or null
   */
  async getNftMetadata(tokenId: string): Promise<any> {
    return await backend.get_nft_metadata(tokenId);
  },

  /**
   * Generates a ZK proof mock
   * @param verificationHash The verification hash
   * @returns Promise with ZK proof data
   */
  async generateZkProofMock(verificationHash: string): Promise<any> {
    return await backend.generate_zk_proof_mock(verificationHash);
  },
};

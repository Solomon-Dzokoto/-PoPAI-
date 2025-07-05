import { describe, expect, it, vi } from "vitest";

// Mock the backend service
vi.mock("../src/services/backendService", () => ({
    backendService: {
        greet: vi.fn(),
        getCount: vi.fn(),
        incrementCounter: vi.fn(),
        sendLlmPrompt: vi.fn(),
        startVerificationChallenge: vi.fn(),
        submitChallengeResult: vi.fn(),
        getNftMetadata: vi.fn(),
        generateZkProofMock: vi.fn(),
    },
}));

describe("Simple Test", () => {
    it("should pass", () => {
        expect(true).toBe(true);
    });
});

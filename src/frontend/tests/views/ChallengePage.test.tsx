import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { StrictMode } from "react";
import ChallengePage from "../../src/views/ChallengePage";

// Mock the backend service
vi.mock("../../src/services/backendService", () => ({
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

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock navigator.mediaDevices
const mockGetUserMedia = vi.fn();
Object.defineProperty(navigator, "mediaDevices", {
    value: {
        getUserMedia: mockGetUserMedia,
    },
    writable: true,
});

// Mock Math.random
const mockMathRandom = vi.spyOn(Math, "random");

// Import backend service after mock
import { backendService } from "../../src/services/backendService";

describe("ChallengePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.clearAllTimers();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const renderWithRouter = (component: React.ReactElement) => {
        return render(
            <StrictMode>
                <MemoryRouter>
                    {component}
                </MemoryRouter>
            </StrictMode>
        );
    };

    it("should show loading state while checking camera permissions", () => {
        // Setup - no response from getUserMedia yet
        mockGetUserMedia.mockImplementation(() => new Promise(() => { }));

        // Execute
        renderWithRouter(<ChallengePage />);

        // Assert
        expect(screen.getByText("Checking camera permissions...")).toBeInTheDocument();
    });

    it("should show webcam access denied message when camera permission is denied", async () => {
        // Setup
        mockGetUserMedia.mockRejectedValue(new Error("Permission denied"));

        // Execute
        renderWithRouter(<ChallengePage />);

        // Assert
        await waitFor(() => {
            expect(screen.getByText("Webcam Access Denied")).toBeInTheDocument();
        });
        expect(screen.getByText(/PoPAI requires webcam access/)).toBeInTheDocument();
    });

    it("should render the challenge interface when webcam access is granted", async () => {
        // Setup
        mockGetUserMedia.mockResolvedValue({} as MediaStream);

        // Execute
        renderWithRouter(<ChallengePage />);

        // Assert
        await waitFor(() => {
            expect(screen.getByText("Verification Challenge")).toBeInTheDocument();
        });
        expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        expect(screen.getByText("Webcam feed will appear here")).toBeInTheDocument();
    });

    it("should start a random challenge when Start Challenge button is clicked", async () => {
        // Setup
        mockGetUserMedia.mockResolvedValue({} as MediaStream);
        const mockChallenge = {
            id: 'test-challenge-1',
            prompt_type: { Blink: null },
            prompt_text: 'Blink twice slowly',
            nonce: 'test-nonce',
        };
        
        vi.mocked(backendService.startVerificationChallenge).mockResolvedValue(mockChallenge);

        renderWithRouter(<ChallengePage />);

        await waitFor(() => {
            expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        });

        // Execute
        fireEvent.click(screen.getByText("Start Challenge"));

        // Assert
        await waitFor(() => {
            expect(backendService.startVerificationChallenge).toHaveBeenCalled();
        });
        
        await waitFor(() => {
            expect(screen.getByText("Challenge: Blink twice slowly")).toBeInTheDocument();
        });
    });

    it("should countdown from challenge duration when challenge starts", async () => {
        // Setup
        mockGetUserMedia.mockResolvedValue({} as MediaStream);
        mockMathRandom.mockReturnValue(0.1); // Will select first challenge (blink)

        renderWithRouter(<ChallengePage />);

        await waitFor(() => {
            expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        });

        // Execute
        fireEvent.click(screen.getByText("Start Challenge"));

        // Assert initial countdown
        expect(screen.getByText("5")).toBeInTheDocument();

        // Advance timer and check countdown
        vi.advanceTimersByTime(1000);
        await waitFor(() => {
            expect(screen.getByText("4")).toBeInTheDocument();
        });

        vi.advanceTimersByTime(1000);
        await waitFor(() => {
            expect(screen.getByText("3")).toBeInTheDocument();
        });
    });

    it("should show verifying message when countdown reaches zero", async () => {
        // Setup
        mockGetUserMedia.mockResolvedValue({} as MediaStream);
        mockMathRandom.mockReturnValue(0.1); // Will select first challenge (blink)

        renderWithRouter(<ChallengePage />);

        await waitFor(() => {
            expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        });

        // Execute
        fireEvent.click(screen.getByText("Start Challenge"));

        // Fast forward through countdown
        vi.advanceTimersByTime(5000);

        // Assert
        await waitFor(() => {
            expect(screen.getByText("Verifying...")).toBeInTheDocument();
        });
    });

    it("should show success message and navigate to success page on successful verification", async () => {
        // Setup
        mockGetUserMedia.mockResolvedValue({} as MediaStream);
        mockMathRandom.mockReturnValue(0.8); // Will trigger success (> 0.3)

        renderWithRouter(<ChallengePage />);

        await waitFor(() => {
            expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        });

        // Execute
        fireEvent.click(screen.getByText("Start Challenge"));

        // Fast forward through countdown and verification
        vi.advanceTimersByTime(5000);
        vi.advanceTimersByTime(2000);

        // Assert
        await waitFor(() => {
            expect(screen.getByText("Verification Successful!")).toBeInTheDocument();
        });
        expect(screen.getByText("Redirecting you...")).toBeInTheDocument();

        // Fast forward to navigation
        vi.advanceTimersByTime(2000);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/success");
        });
    });

    it("should show failure message with try again button on failed verification", async () => {
        // Setup
        mockGetUserMedia.mockResolvedValue({} as MediaStream);
        mockMathRandom.mockReturnValue(0.1); // Will trigger failure (< 0.3)

        renderWithRouter(<ChallengePage />);

        await waitFor(() => {
            expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        });

        // Execute
        fireEvent.click(screen.getByText("Start Challenge"));

        // Fast forward through countdown and verification
        vi.advanceTimersByTime(5000);
        vi.advanceTimersByTime(2000);

        // Assert
        await waitFor(() => {
            expect(screen.getByText("Verification Failed")).toBeInTheDocument();
        });
        expect(screen.getByText("Try Again")).toBeInTheDocument();
        expect(screen.getByText(/Please try again/)).toBeInTheDocument();
    });

    it("should reset challenge when Try Again button is clicked", async () => {
        // Setup
        mockGetUserMedia.mockResolvedValue({} as MediaStream);
        mockMathRandom.mockReturnValue(0.1); // Will trigger failure (< 0.3)

        renderWithRouter(<ChallengePage />);

        await waitFor(() => {
            expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        });

        // Execute - start challenge and fail
        fireEvent.click(screen.getByText("Start Challenge"));
        vi.advanceTimersByTime(5000);
        vi.advanceTimersByTime(2000);

        await waitFor(() => {
            expect(screen.getByText("Try Again")).toBeInTheDocument();
        });

        // Execute - click try again
        fireEvent.click(screen.getByText("Try Again"));

        // Assert
        expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        expect(screen.queryByText("Verification Failed")).not.toBeInTheDocument();
    });

    it("should handle microphone challenges correctly when mic access is granted", async () => {
        // Setup
        mockGetUserMedia
            .mockResolvedValueOnce({} as MediaStream) // video
            .mockResolvedValueOnce({} as MediaStream); // audio
        mockMathRandom.mockReturnValue(0.6); // Will select say_phrase challenge

        renderWithRouter(<ChallengePage />);

        await waitFor(() => {
            expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        });

        // Execute
        fireEvent.click(screen.getByText("Start Challenge"));

        // Assert
        await waitFor(() => {
            expect(screen.getByText('Challenge: Say "PoPAI is cool"')).toBeInTheDocument();
        });
        expect(screen.getByText("Microphone active")).toBeInTheDocument();
    });

    it("should show microphone unavailable message for mic challenges when mic access is denied", async () => {
        // Setup
        mockGetUserMedia
            .mockResolvedValueOnce({} as MediaStream) // video
            .mockRejectedValueOnce(new Error("Mic denied")); // audio

        // Mock alert to verify it's called
        const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => { });

        renderWithRouter(<ChallengePage />);

        await waitFor(() => {
            expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        });

        // Force a mic-requiring challenge
        vi.mocked(mockMathRandom).mockReturnValue(0.6); // say_phrase challenge

        // Execute
        fireEvent.click(screen.getByText("Start Challenge"));

        // Assert
        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith(
                expect.stringContaining("This challenge requires microphone access")
            );
        });

        mockAlert.mockRestore();
    });

    it("should filter out microphone challenges when mic is not available", async () => {
        // Setup
        mockGetUserMedia
            .mockResolvedValueOnce({} as MediaStream) // video
            .mockRejectedValueOnce(new Error("Mic denied")); // audio
        mockMathRandom.mockReturnValue(0.1); // Will select first available challenge

        renderWithRouter(<ChallengePage />);

        await waitFor(() => {
            expect(screen.getByText("Start Challenge")).toBeInTheDocument();
        });

        // Execute
        fireEvent.click(screen.getByText("Start Challenge"));

        // Assert - should get a non-mic challenge
        await waitFor(() => {
            expect(screen.getByText("Challenge: Blink twice")).toBeInTheDocument();
        });
        expect(screen.queryByText("Microphone active")).not.toBeInTheDocument();
    });
});

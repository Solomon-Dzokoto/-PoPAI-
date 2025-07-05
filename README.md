# 🛡️ PoPAI: Proof of Personhood via AI

PoPAI is a fully on-chain, privacy-preserving Proof-of-Personhood (PoP) system that leverages AI-based liveness and uniqueness verification, deployed on the Internet Computer Protocol (ICP). It ensures a user is a unique human—without storing sensitive biometrics or relying on centralized providers.

## Welcome! 👋

This repository contains the source code for PoPAI. It utilizes a robust foundation for Internet Computer (ICP) development, including:

- 🦀 **Rust-based Canister** backend for PoPAI logic.
- ⚛️ **React + TailwindCSS + Framer Motion + Typescript** frontend for a modern user experience.
- 🧪 **Full Test Suite**: Vitest + PocketIC for backend and frontend testing.
- 🔁 **CI/CD** with GitHub Actions for automated tests and code quality.
- 🤖 **Copilot Integration** to assist with development.

This project aims to provide a secure, private, and decentralized way to verify personhood for Web3 applications.

---

## 📜 Table of Contents

- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [✅ Testing Patterns](#-testing-patterns)
- [🔄 CI/CD Workflow](#-cicd-workflow)
- [🧠 GitHub Copilot Integration](#-github-copilot-integration)
- [🔗 Resources & Documentation](#-learning-resources)
- [📩 Submit Your Project!](#-submit-your-project)

---
---

## 🚀 Getting Started

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) (v18 or later recommended) installed.
- Install the DFINITY Canister SDK [dfx](https://internetcomputer.org/docs/current/developer-docs/setup/install).
- This project is preconfigured for Gitpod or GitHub Codespaces for a seamless setup experience (see `.devcontainer/devcontainer.json`).

### 1. Clone the Repository

```bash
git clone <repository-url>
cd popai-project-directory
```
*(Replace `<repository-url>` and `popai-project-directory`)*

### 2. Install Frontend Dependencies

The frontend project is located in `src/frontend`.

```bash
cd src/frontend
npm install
cd ../..
```
*(This brings you back to the root directory)*

Alternatively, from the root directory:
```bash
npm install --prefix src/frontend
```

### 3. Start the Local Replica

In one terminal window, navigate to the project root and run:

```bash
dfx start --clean --background
```
*(The `--background` flag is optional; remove it to see replica logs in the current terminal).*

### 4. Deploy Canisters

In another terminal window, from the project root:

```bash
dfx deploy
```
This command will deploy the `backend` (PoPAI logic) and `frontend` canisters as defined in `dfx.json`.
*(Note: The project also includes an `llm` canister in `dfx.json` as part of the original template. It will be deployed but is not actively used by the core PoPAI mock functionality).*

### 5. Start the Frontend Development Server

To run the React frontend with hot reloading:

```bash
cd src/frontend
npm start
```
The application will typically be available at `http://localhost:5173` (Vite's default) or a port provided by `dfx`. Check the output of `dfx deploy` for the frontend canister URL.

### 6. Run Tests

```bash
npm test
```

You can also run:

```bash
npm test tests/src/backend.test.ts    # individual test
```

---

## 📁 Project Structure

```
ICP-Bootcamp-Vibe-Coding/
├── .devcontainer/devcontainer.json       # Container config for running your own codespace
├── .github/instructions/                 # Copilot general and language specific instructions
├── .github/prompts/                      # Copilot Prompts, like add feature and changes review
├── .github/workflows/                    # GitHub CI/CD pipelines
├── src/
│   ├── backend/                          # Rust backend canister
│   │   ├── src/
│   │   │   └── lib.rs                    # Main Rust file
│   │   └── Cargo.toml                    # Rust dependencies
│   ├── frontend/                         # React + Tailwind + TypeScript frontend
│   │   ├── src/
│   │   │   ├── App.tsx                   # Main App component
│   │   │   ├── index.css                 # Global styles with Tailwind
│   │   │   ├── components/               # Reusable UI components
│   │   │   ├── services/                 # Canister service layers (e.g., actor creation)
│   │   │   └── views/                    # Page-level components (HomePage, ChallengePage, etc.)
│   │   ├── assets/                       # Static assets
│   │   ├── tests/                        # Frontend unit/integration tests
│   │   ├── index.html                    # HTML entry point
│   │   ├── main.tsx                      # React root
│   │   ├── package.json                  # Frontend npm dependencies
│   │   ├── tsconfig.json                 # TypeScript config for frontend
│   │   ├── vite.config.ts                # Vite config
│   │   └── vite-env.d.ts                 # Vite environment types
│   ├── shared_types/                     # TypeScript types shared between frontend and backend (manual, for reference)
│   │   └── index.ts
│   └── declarations/                     # Auto-generated canister interface types (from .did files)
├── tests/                                # Root test directory (Vitest with PocketIC)
│   ├── src/                              # Backend integration tests
│   ├── backend-test-setup.ts             # PocketIC setup for backend tests
│   └── vitest.config.ts                  # Vitest configuration
├── scripts/
│   ├── dev-container-setup.sh            # Extra set up steps for codespace
│   └── generate-candid.sh                # Useful one way script to build, generate candid and did files
├── dfx.json                              # ICP config
├── Cargo.toml                            # Root Rust workspace config
└── CHANGELOG.md
```

---

## 🔄 CI/CD Workflow

Located under `.github/workflows/`, this includes:

- 🧪 Automated end-2-end test runs

It could be extended to:

- check for security updates (audit);
- test coverage;
- code quality.

---

## 🧠 **GitHub Copilot Integration**

This project leverages two key customization folders:

- `.github/instructions/` – Provides essential context to guide AI responses.
- `.github/prompts/` – Defines workflow prompts to effectively assist you.

Think of the AI as a super-fast junior developer, handling the heavy lifting while you focus on quality control. Instead of using PRs, you’re reviewing and refining code directly in the IDE through Copilot chat.

### 📝 **About Instructions**

Instructions provide "context" that applies to specific files using regex patterns defined in `applyTo`. They are ideal for project-wide or language-specific guidance.

**Current Instructions:**

- **general:** `applyTo: **`
- **rust:** `applyTo: */*.rs`
- **test:** `applyTo: tests/**`

**Examples of Context You Can Define:**

- This is an ICP project using Rust canisters.
- For Rust, we follow Clippy and Rust FMT style guides and linting tools.
- For tests, we use **Pocket IC** and maintain a specific test structure.

### 🛠️ **About Prompts**

Prompts define specific tasks and guide the AI through a structured workflow. They are especially useful for maintaining a consistent development process.

---

#### ✨ **Add Feature Prompt**

```markdown
/add-feature Add a function to decrease the counter value
```

In this workflow, Copilot follows a Spec Driven Workflow:

1. Clarification Phase:
   • Updates the changelog and asks for any necessary clarifications.
2. Test First Approach:
   • Generates a test case and ensures it fails, confirming that the test is effectively targeting the desired behavior.
3. Human Confirmation:
   • The AI pauses for a human to review and confirm the spec, ensuring alignment before proceeding.
4. Implementation Phase:
   • Implements the code, self-checks for errors, installs necessary libraries, lints, formats, and runs tests to confirm they pass.

**✅ Key Takeaways**

When you explore the prompt, please notice:

- CRITICAL PAUSE POINTS
  - Strategic pauses allow the human to verify the work in small, reviewable chunks and redirect if necessary.
- Command Explanations
  - The prompt can include specific commands or scripts, guiding the AI in self-checking, running scripts, or managing dependencies.
- Task-Specific Advice
  - The prompt is the place to add any specific guidance or notes relevant only to the particular task at hand.

#### 🚧 **Changes Review Prompt**

To run a review, simply call the prompt:

```markdown
/changes-review
```

The AI will analyze the current git diffs, then reference other files in the repo for context. It will generate a comprehensive report for you to review before committing.

#### ✅ **Focus Areas**

1. **Business Logic:**

   - Detects potential unwanted side effects or missing edge cases.

2. **Code Quality:**

   - Suggests improvements or refactor opportunities.

3. **Security & Performance:**
   - Identifies vulnerabilities or inefficiencies.

#### 📌 **Why It Matters**

- AI can handle the heavy lifting, but it's **your responsibility as the Senior** to validate the findings.
- Double-check and ensure quality – small issues now can become big problems later. 😉

---

## 📚 Learning Resources

- [Instruction and Prompt Files](https://code.visualstudio.com/docs/copilot/copilot-customization)
- [Agent Mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)
- [Copilot Reference](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features)
- [ICP Dev Docs](https://internetcomputer.org/docs)
- [Rust CDK](https://internetcomputer.org/docs/current/developer-docs/backend/rust/)
- [PicJS Doc](https://dfinity.github.io/pic-js/) <!-- Note: This might be PocketIC.js, link should be verified -->
- [Vitest Testing Framework](https://vitest.dev/)

---

### 🤝 **Contributing**

We welcome contributions! If you encounter a bug, have a feature request, or want to suggest improvements, please open an issue or submit a Pull Request.

<!--
We especially welcome candidates of limits you face, consider using the **Limit Candidate Form Issue** – it helps us prioritize and address the most impactful limits effectively.
-->
<!-- This section can be tailored or removed if not applicable -->

---

**Now go build something amazing with PoPAI! 🛡️🚀**

use candid::{CandidType, Principal};
use ic_cdk::api::time;
use ic_cdk::export_candid;
use serde::Deserialize;
use std::cell::RefCell;
use std::collections::HashMap;

// Keep existing LLM imports if they are still needed, or remove if not.
// For this PoPAI implementation, they are not directly used but are kept to avoid breaking existing frontend calls.
use ic_llm::{ChatMessage as LlmChatMessage, Model as LlmModel};


// --- POLLING PLACEHOLDER ---
// This is a placeholder for where you might integrate with an external AI service
// if not running models directly on IC. For this PRD, AI runs on-chain.
// However, this structure can be useful for other off-chain interactions if needed.
// #[derive(CandidType, Deserialize, Debug)]
// struct AiApiResponse {
//     status: String,
//     result: Option<String>, // e.g. "blink_detected_true"
// }
// --- END POLLING PLACEHOLDER ---


// --- PoPAI Specific Data Structures ---

#[derive(CandidType, Clone, Deserialize, Debug, PartialEq, Eq, Hash)]
pub enum PromptType {
    Blink,
    Nod,
    SayPhrase,
}

#[derive(CandidType, Clone, Deserialize, Debug)]
pub struct VerificationChallenge {
    id: String, // Unique ID for this challenge instance
    prompt_type: PromptType,
    prompt_text: String,
    nonce: String, // Random nonce to prevent replay attacks (hex encoded random bytes)
}

#[derive(CandidType, Clone, Deserialize, Debug)]
pub struct VerificationSubmission {
    challenge_id: String,
    mock_data: String, // For mock: "blinked", "nodded", "said_phrase"
    client_timestamp: u64,
    // Additional fields for AI model hooks
    encrypted_biometric_data: Vec<u8>, // Encrypted biometric data for ONNX inference
    behavioral_data: String, // Behavioral data as JSON string
}

#[derive(CandidType, Clone, Deserialize, Debug)]
pub struct VerificationResult {
    success: bool,
    nft_id: Option<String>,
    error_message: Option<String>,
    verification_hash: Option<String>, // On-chain hash of this verification event
}

#[derive(CandidType, Clone, Deserialize, Debug)]
pub struct NftMetadata {
    token_id: String,
    name: String,
    description: String,
    issued_at: u64, // Timestamp
    verification_hash: String,
    owner: Principal, // Soulbound to this principal
                         // Could add challenge_level, expiry, etc.
}

#[derive(CandidType, Clone, Deserialize, Debug)]
pub struct ZkProofMock {
    proof_data: String,
    public_input: String,
}


// --- Canister State ---
thread_local! {
    static COUNTER: RefCell<u64> = RefCell::new(0); // Existing state from template

    // PoPAI State
    static ACTIVE_CHALLENGES: RefCell<HashMap<String, VerificationChallenge>> = RefCell::new(HashMap::new());
    static MINTED_NFTS: RefCell<HashMap<String, NftMetadata>> = RefCell::new(HashMap::new());
    // Store by owner Principal to easily check if a user already has an NFT
    static OWNER_TO_NFT_ID: RefCell<HashMap<Principal, String>> = RefCell::new(HashMap::new());
    static VERIFICATION_LOGS: RefCell<Vec<String>> = RefCell::new(Vec::new()); // Store verification hashes or summary
    static NEXT_NFT_ID: RefCell<u64> = RefCell::new(0);
}

// Helper to generate unique IDs (simplified)
fn generate_id() -> String {
    format!("{}-{}", ic_cdk::api::time(), ic_cdk::api::caller().to_text())
}

async fn generate_nonce() -> String {
    let random_bytes: [u8; 16] = ic_cdk::api::management_canister::main::raw_rand().await.unwrap().0.try_into().unwrap_or_default();
    hex::encode(random_bytes)
}


// --- PoPAI Canister Methods ---

#[ic_cdk::update]
async fn start_verification_challenge() -> VerificationChallenge {
    let caller = ic_cdk::api::caller();
    // Optional: Check if user already has an NFT if it's one-per-person
    if OWNER_TO_NFT_ID.with(|owner_map| owner_map.borrow().contains_key(&caller)) {
        // This is a simple way to handle it. Could also return error or specific status.
        // For now, let them try again, but a real system might prevent multiple NFTs.
        // ic_cdk::trap("User already has a PoPAI NFT.");
    }

    let challenge_id = generate_id();
    let nonce = generate_nonce().await;

    // Randomly select a challenge type (mock)
    // In a real system, AI would adaptively choose this.
    let challenges = [
        (PromptType::Blink, "Blink twice slowly."),
        (PromptType::Nod, "Nod your head up and down."),
        (PromptType::SayPhrase, "Clearly say: 'My identity is sovereign'"),
    ];
    let (prompt_type, prompt_text) = &challenges[ (time() as usize) % challenges.len() ];


    let challenge = VerificationChallenge {
        id: challenge_id.clone(),
        prompt_type: prompt_type.clone(),
        prompt_text: prompt_text.to_string(),
        nonce,
    };

    ACTIVE_CHALLENGES.with(|map| {
        map.borrow_mut().insert(challenge_id, challenge.clone());
    });

    challenge
}

#[ic_cdk::update]
async fn submit_challenge_result(submission: VerificationSubmission) -> VerificationResult {
    let caller = ic_cdk::api::caller();

    // 1. Validate Challenge ID and retrieve challenge details
    let challenge = ACTIVE_CHALLENGES.with(|map| map.borrow_mut().remove(&submission.challenge_id));
    if challenge.is_none() {
        return VerificationResult {
            success: false,
            nft_id: None,
            error_message: Some("Invalid or expired challenge ID.".to_string()),
            verification_hash: None,
        };
    }
    // let _current_challenge = challenge.unwrap(); // We'll use this if we check nonce or specific data

    // 2. Mock AI Verification Logic
    // TODO: Replace with actual AI model inference call
    // For now, simulate success/failure based on mock_data or randomly.
    // Example: if current_challenge.prompt_type == PromptType::Blink && submission.mock_data == "blinked"
    let is_successful_mock = submission.mock_data.contains("blink")
        || submission.mock_data.contains("nod")
        || submission.mock_data.contains("said");

    // Add a bit of randomness to simulate real-world AI variance
    let random_factor_success = (time() % 10) > 2; // 70% chance of passing this random check
    let verification_passed = is_successful_mock && random_factor_success;

    // 3. Generate Verification Hash (mock)
    // In a real system, this would be a hash of significant data: challenge, submission (or its features), timestamp, model hash etc.
    let verification_data_to_hash = format!(
        "{}-{}-{}-{}-{}",
        submission.challenge_id,
        caller.to_text(),
        submission.client_timestamp,
        submission.mock_data,
        verification_passed
    );
    // Using a simple string concatenation for mock; a real hash (e.g., SHA256) should be used.
    let verification_hash = format!("mock_hash_{:x}", md5::compute(verification_data_to_hash.as_bytes()).0.iter().fold(0u64, |acc, &byte| (acc << 8) | byte as u64));


    VERIFICATION_LOGS.with(|log| log.borrow_mut().push(verification_hash.clone()));

    if verification_passed {
        // 4. Mint Soulbound NFT (mock DIP-721) if successful
        // Check if user already has an NFT by this canister
        if OWNER_TO_NFT_ID.with(|owner_map| owner_map.borrow().contains_key(&caller)) {
            let existing_nft_id = OWNER_TO_NFT_ID.with(|om| om.borrow().get(&caller).unwrap().clone());
             return VerificationResult {
                success: true, // Still a success, but they get their existing token
                nft_id: Some(existing_nft_id),
                error_message: Some("User already verified. Returning existing token ID.".to_string()),
                verification_hash: Some(verification_hash),
            };
        }

        let nft_id_num = NEXT_NFT_ID.with(|id_counter| {
            let current_id = *id_counter.borrow();
            *id_counter.borrow_mut() = current_id + 1;
            current_id
        });
        let token_id = format!("POP-{}", nft_id_num);

        let nft_metadata = NftMetadata {
            token_id: token_id.clone(),
            name: "PoPAI Verified Human".to_string(),
            description: "This token certifies that the holder has successfully passed a PoPAI liveness and uniqueness challenge.".to_string(),
            issued_at: time(),
            verification_hash: verification_hash.clone(),
            owner: caller,
        };

        MINTED_NFTS.with(|nfts| nfts.borrow_mut().insert(token_id.clone(), nft_metadata));
        OWNER_TO_NFT_ID.with(|owner_map| owner_map.borrow_mut().insert(caller, token_id.clone()));

        // Call AI model hooks for additional verification
        let _biometric_result = onnx_inference_hook(&submission.encrypted_biometric_data);
        let _behavioral_score = behavioral_scoring_hook(&submission.behavioral_data);

        VerificationResult {
            success: true,
            nft_id: Some(token_id),
            error_message: None,
            verification_hash: Some(verification_hash),
        }
    } else {
        VerificationResult {
            success: false,
            nft_id: None,
            error_message: Some("AI verification check failed. Please try again.".to_string()),
            verification_hash: Some(verification_hash),
        }
    }
}

#[ic_cdk::query]
fn get_nft_metadata(token_id: String) -> Option<NftMetadata> {
    MINTED_NFTS.with(|nfts| nfts.borrow().get(&token_id).cloned())
}

// Optional: Mock ZK Proof Generation
#[ic_cdk::update] // Should be update if it involves state change or significant computation
async fn generate_zk_proof_mock(verification_hash: String) -> ZkProofMock {
    // Simulate ZK proof generation based on a verification hash
    // In reality, this would involve complex cryptographic operations
    // and would take the actual private inputs (biometric features)

    // Placeholder: AI model execution hash (would come from the model run)
    let model_execution_hash = "mock_model_hash_abc123";

    let public_input = format!("verification_hash:{},model_hash:{}", verification_hash, model_execution_hash);
    let proof_data = format!("mock_zk_proof_for_{}", public_input);

    // Simulate a delay for computation
    // ic_cdk_timers::set_timer(std::time::Duration::from_secs(1), || {}).await; // Requires ic-cdk-timers
    // For simplicity, no actual timer here, just returning the mock data.

    ZkProofMock {
        proof_data,
        public_input,
    }
}

// --- Placeholder Hooks for AI Model Integration ---
// These functions are stubs. In a real implementation, they would contain
// logic to preprocess data, call the ONNX/Wasm models, and interpret results.

fn onnx_inference_hook(encrypted_data: &Vec<u8>) -> bool {
    // 1. Decrypt data (if client-side encryption was used and server needs raw)
    // 2. Preprocess data for ONNX model input format
    // 3. Call ONNX runtime with the model and input
    //    (Requires ONNX runtime Wasm build and ic-sys/ic0 calls for resource limits)
    // 4. Interpret model output (e.g., liveness score, feature vector)
    ic_cdk::println!("Placeholder: ONNX inference hook called with data of length {}", encrypted_data.len());
    true // mock result
}

fn behavioral_scoring_hook(behavioral_data: &String) -> f32 {
    // 1. Parse behavioral data (e.g., mouse movements, reaction times json)
    // 2. Apply scoring logic or pass to a behavioral model
    ic_cdk::println!("Placeholder: Behavioral scoring hook called with data: {}", behavioral_data);
    0.95 // mock score
}


// --- Existing Canister Methods (from template) ---
// These are kept to ensure the frontend parts that might call them don't break immediately.
// They can be removed if the frontend is fully switched to PoPAI calls.

#[ic_cdk::update]
async fn prompt(prompt_str: String) -> String {
    // Ensure LlmModel and LlmChatMessage are correctly namespaced if used.
    ic_llm::prompt(LlmModel::Llama3_1_8B, prompt_str).await
}

#[ic_cdk::update]
async fn chat(messages: Vec<LlmChatMessage>) -> String {
    let response = ic_llm::chat(LlmModel::Llama3_1_8B)
        .with_messages(messages)
        .send()
        .await;
    response.message.content.unwrap_or_default()
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::update]
fn increment() -> u64 {
    COUNTER.with(|counter| {
        let val = *counter.borrow() + 1;
        *counter.borrow_mut() = val;
        val
    })
}

#[ic_cdk::query]
fn get_count() -> u64 {
    COUNTER.with(|counter| *counter.borrow())
}

#[ic_cdk::update]
fn set_count(value: u64) -> u64 {
    COUNTER.with(|counter| {
        *counter.borrow_mut() = value;
        value
    })
}

// Export Candid interface
export_candid!();

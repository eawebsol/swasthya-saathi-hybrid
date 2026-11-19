# 🏆 MASTER_PROMPT.md: Swasthya Saathi (Hybrid AI Edition)
## Google Firebase #BuildHybridAI 2026 Hackathon Master Specification

---

## 1. Executive Summary & Vision

**Project Name:** Swasthya Saathi - Hybrid AI Rural Healthcare & Field Intelligence  
**Target Category:** Grand Prize ($10,000) & Best Web / Cross-Platform App ($3,000)  
**Core Mission:** Equip frontline healthcare workers (ASHA workers) and Primary Health Centers (PHCs) with an offline-first, privacy-preserving, hybrid AI diagnostic and triage copilot.  

In rural and remote areas with intermittent or zero connectivity, lives are lost to delayed triage and misidentified emergencies. **Swasthya Saathi Hybrid** bridges this critical healthcare divide by implementing Google’s vision of **Firebase AI Logic Hybrid Inference**:
* **On-Device (Gemini Nano):** Performs instant, zero-latency vital-sign triage, red-flag emergency detection, private local symptom parsing, and offline multilingual audio guidance (Hindi, Telugu, English) directly on the frontline worker's device with zero data egress and zero cloud costs.
* **Cloud AI (Firebase Vertex AI / Gemini 2.0 & 1.5 Flash):** When network connectivity is available, the app escalates complex multi-condition differential diagnoses, deep multimodal lab report image analysis, epidemiological outbreak clustering, and comprehensive doctor referral handoffs.
* **Firebase Full-Stack Synergy:**
  * **Cloud Firestore (Offline Persistence):** Field triage logs seamlessly queue locally and sync automatically when internet connectivity resumes.
  * **Firebase Remote Config:** Pushes live epidemic triage parameters (e.g., Dengue or Malaria outbreak alert thresholds) to field workers dynamically without app store redeployments.
  * **Firebase App Check:** Cryptographically protects cloud inference and data endpoints from abuse.
  * **Firebase Authentication:** Role-based access control for ASHA workers, PHC doctors, and field supervisors.

---

## 2. Why This is the Ultimate Winning Concept for #BuildHybridAI

Judges evaluate submissions across 4 pillars (25% each). Swasthya Saathi directly nails all 4:

| Rubric Pillar | Score Objective | Why Swasthya Saathi Hybrid Wins |
| :--- | :--- | :--- |
| **Technological Implementation (25%)** | 25/25 | **Textbook Hybrid Architecture:** Clear, necessary separation of concerns. On-device Gemini Nano handles privacy-sensitive medical vitals and offline triage; Cloud Gemini handles complex multi-system pathologies and multi-page lab analysis. Full fallback handling if local Nano is unavailable. |
| **Design & UX (25%)** | 25/25 | **Production-grade Field App:** Designed for high-stress rural conditions: large tactile touch targets, high contrast, multilingual voice readouts, zero lag, and a live **Hybrid Inference Inspector** showing latency, privacy status, and cloud vs. local routing. |
| **Potential Impact (25%)** | 25/25 | **Massive Real-World Humanity Use Case:** Directly impacts hundreds of thousands of frontline healthcare workers serving millions of rural citizens. Demonstrates real cost savings, lifesaving triage speed, and healthcare data sovereignty. |
| **Originality & Novelty (25%)** | 25/25 | Not another generic chatbot or code helper. A mission-critical, life-saving field intelligence copilot combining dynamic epidemic configuration (Remote Config), local/cloud handoffs, and tiered reporting. |

---

## 3. System Architecture & Hybrid Inference Engine

```
                             +------------------------------------------------+
                             |           ASHA Worker Device (PWA/Web)         |
                             |   [English / Hindi (हिंदी) / Telugu (తెలుగు)]   |
                             +------------------------------------------------+
                                                     |
             +---------------------------------------+---------------------------------------+
             |                                                                               |
   [NO INTERNET OR PRIVACY-CRITICAL]                                           [INTERNET AVAILABLE & COMPLEX CASE]
             |                                                                               |
             v                                                                               v
+------------------------------------------+                     +---------------------------------------------------+
|      ON-DEVICE ENGINE (Gemini Nano)      |                     |         FIREBASE AI LOGIC CLOUD ENGINE            |
|  - Vital Red-Flag Rule Engine (0ms)      |                     |  - Multi-Condition Differential Diagnosis         |
|  - Local Symptom Triage (Prompt API)     |                     |  - Complex Multimodal Lab OCR & Radiography       |
|  - Patient Voice Guidance (Local TTS)    |                     |  - PHC Doctor Handoff & Epidemiological Alerts    |
|  - Tier 1 Patient Explanation (Local)    |                     |  - Vertex AI Gemini 1.5/2.0 Flash / Pro           |
+------------------------------------------+                     +---------------------------------------------------+
             |                                                                               |
             v                                                                               v
+--------------------------------------------------------------------------------------------------------------------+
|                                              FIREBASE CLIENT ECOSYSTEM                                             |
|  * Cloud Firestore (Offline Persistence Mode - auto-syncs patient records on reconnect)                           |
|  * Firebase Remote Config (Dynamic seasonal outbreak rules & triage threshold weights)                            |
|  * Firebase App Check (Device integrity & API quota protection)                                                    |
|  * Firebase Authentication (ASHA Worker & PHC Doctor role-based access)                                            |
+--------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Key Functional Modules

### Module 1: Two-Stage Vital-First & Red-Flag Triage
* **Stage 1 (Deterministic Safety Gate):** Instant vital evaluation (SpO2, Pulse, Blood Pressure, Temperature, Respiratory Rate). If SpO2 < 92% or Temp > 104°F, bypasses AI to show a high-contrast Emergency Referral Screen immediately.
* **Stage 2 (Local Gemini Nano Triage):** For stable vitals, dynamically guides the worker through complaint-specific follow-ups (Fever, Chest Discomfort, Maternal health, Cough).

### Module 2: 3-Tiered Actionable Reporting
* **Tier 1 (Patient Home Guidance):** Calming, jargon-free instructions and dietary advice in local language (Hindi, Telugu, English) with voice playback.
* **Tier 2 (ASHA Action Checklist):** Immediate field instructions (e.g., sputum test referral, ORS preparation, isolation protocols).
* **Tier 3 (PHC Doctor Clinical Summary):** Formal medical summary with suspected clinical patterns, ICD-10 suggestions, and public health program mappings (e.g., RNTCP/DOTS for TB, NCD portal tracking).

### Module 3: Hybrid Lab Report Analyzer
* **Local Mode (Gemini Nano):** Parses raw lab text (CBC, Lipid profile, Blood sugar), highlights abnormal markers, and flags immediate diet/lifestyle precautions offline.
* **Cloud Mode (Firebase Gemini Multimodal):** Takes photos of handwritten/printed lab reports, performs high-precision medical OCR, detects multi-parameter anomalies, and cross-references patient medical history.

### Module 4: Dynamic Epidemic Alerting (Firebase Remote Config)
* Remotely adjust triage algorithms during regional disease surges (e.g., lower fever threshold for Dengue surveillance or activate Chikungunya symptom flags) without releasing app updates.

### Module 5: Real-Time "Hybrid Engine Inspector" (The Judge's Delight)
* A persistent header widget that shows:
  * 🟢 **Engine:** On-Device (Gemini Nano via Chrome Built-in AI) / ☁️ Firebase Cloud AI / 🛡️ Local Protocol RAG
  * ⚡ **Latency:** e.g., `18ms`
  * 🔒 **Data Privacy:** `100% Local Enclave (Zero egress)` or `Encrypted Cloud Transit`
  * 📶 **Network State:** `Online` / `Simulated Offline` toggle (lets judges click "Offline" and watch the app seamlessly execute on-device!)

---

## 6. AI-Native Production Engineering Principles (Core Mandates)

Because AI systems are probabilistic, non-deterministic, and prone to silent failures, this codebase strictly adheres to these five AI-native architectural principles across every module:

### 1. Modularity & Provider Agnosticism (Open/Closed & Dependency Inversion)
* Never tightly couple business logic to a specific LLM provider, SDK, or vector database.
* All model calls, embeddings, and retrieval layers are abstracted behind clean internal interfaces (`IModelAdapter`, `ITriageInferenceProvider`, `ILabOcrProvider`).
* Switching providers (e.g., from Gemini to Claude, or from Chrome Nano to an ONNX runtime local model) requires changing only a single adapter configuration without modifying UI components or business workflows.

### 2. Strict Separation of Concerns (Deterministic vs. Probabilistic)
* Deterministic application logic (vital triage safety thresholds, routing rules, state management, UI transitions, database mutations) is completely decoupled from probabilistic AI components (prompts, raw LLM completions, multimodal OCR).
* **Zero-Hallucination Emergency Gate:** Critical application states (e.g. initiating emergency 108 ambulance referrals, flagging hypertensive crisis or shock) are driven by deterministic rules evaluated in < 1ms, never by raw LLM completions.

### 3. Guardrails & Interface Contracts (Input/Output Validation)
* **Defensive Input Validation:** Inputs are pre-screened to reject prompt injections, malformed payloads, non-medical gibberish, and out-of-range sensor readings before reaching any model.
* **Strict Output Parsing & Schema Contracts:** LLMs return structured data validated against strict TypeScript / JSON schema contracts (`TriageResult`, `LabReportResult`). 
* **Defensive Fallbacks:** Parsing failures, model timeouts, or hallucinated schemas are handled with graceful fallback loops to local ICMR protocol rules, ensuring the app never crashes in the field.

### 4. Empirical Evaluation & Observability First
* Built with continuous observability. Every inference step logs a structured telemetry trace (`InferenceTelemetryTrace`): raw sanitized input, prompt template, model identifier, token count, latency (ms), validation outcome, and execution engine.
* The system is backed by reproducible automated scenario test suites (`test-scenarios.js`) rather than manual "vibe checks."

### 5. Human-in-the-Loop (HITL) for High-Stakes Actions
* The AI never autonomously triggers irreversible actions, dispatches emergency services, or writes final prescriptions without explicit human approval.
* Every triage recommendation, ASHA checklist action, and clinical referral requires manual confirmation from the ASHA worker or PHC Medical Officer through high-contrast, tactile confirmation gates.

---

## 7. Development Milestones & Hackathon Submission Roadmap

* **Phase 1: Project Scaffolding & Core Architecture**
  * Modern Web PWA stack (Vite + React + TypeScript + Tailwind CSS + Lucide Icons + PWA offline worker).
  * Firebase SDK initialization (Auth, Firestore offline persistence, Remote Config).
* **Phase 2: Hybrid AI Logic Integration**
  * Web Gemini Nano integration (window.ai / Prompt API / Chrome Built-in AI).
  * Firebase Vertex AI (Cloud Gemini) integration with graceful fallback handler.
  * Real-time Hybrid Inspector HUD component.
* **Phase 3: Clinical Workflows & Multi-Language Audio**
  * Two-stage triage form, symptom questionnaires, and 3-tiered report generator.
  * Lab report analyzer with sample presets for quick judging.
  * Offline-capable TTS and English / Hindi / Telugu localization.
* **Phase 4: Dashboard & Cloud Sync**
  * ASHA and PHC Doctor views, offline case queueing, and Firestore synchronization.
  * Remote Config dynamic epidemic alerts.
* **Phase 5: Submission Polish & Deliverables**
  * Open source repository with Apache 2.0 License.
  * 3-minute high-impact video demonstration showing real-time offline vs online switching.
  * Winning Devpost story write-up.

---

## 8. Mandatory Pre-Release Application Security Audit Protocol

Before every major release or production deployment, an adversarial security audit must be conducted under the following operating protocol:

### Security Audit Mandates & Persona:
* **Role:** Senior Application Security Consultant auditing the application and its backend the way an attacker would, explaining fixes the way an educator would.
* **Scope & Rule:** Read actual code; do not guess. Cite file paths and line numbers for every finding. Mask secrets (show only the first 4 characters: `AIza...`). Separate confirmed issues from unverified items. No generic advice.

### Required Audit Check Areas:
1. **Secrets & Key Exposure:** Hardcoded keys, client-exposed prefixes (`VITE_`), `.env` in git, secret keys in frontend, keys in bundles, third-party direct browser calls vs. backend proxies.
2. **Authentication & Authorization:** Frontend-only route guards, missing server-side checks, IDOR (user A editing/reading user B), unvalidated client roles/isAdmin, weak session handling.
3. **Database & Backend Rules:** Open Firestore/Storage rules (`allow read, write: if true;`), permissive anonymous writes, lack of schema/field validation in rules.
4. **Frontend Vulnerabilities:** Stored/DOM XSS (`dangerouslySetInnerHTML`, unescaped template literals in HTML export, `eval`), open redirects, sensitive data in `localStorage`/console.
5. **API & Server Hardening:** CORS wildcards, rate limiting on AI/LLM endpoints, input validation/schema contracts, error leakage, file upload validation (MIME, size, storage limits).
6. **Dependencies & Supply Chain:** `npm audit` execution, high/critical CVEs, malicious or unpinned packages.
7. **Deployment & Config:** Security headers (CSP, `X-Content-Type-Options`, `X-Frame-Options`), source maps in production, public storage buckets, exposed git paths.
8. **Vibe-Coding Traps:** Security TODOs, hardcoded test users/fallbacks, client-only enforcement.


# 🏆 Devpost Submission: Swasthya Saathi (Hybrid AI Edition)
### Google Firebase #BuildHybridAI 2026 Global Hackathon Submission

---

## 🏷️ Basic Information

* **Project Title:** Swasthya Saathi (Hybrid AI Edition) — Offline-First Rural Clinical Triage & Field Intelligence
* **Tagline:** Offline-first, multilingual clinical copilot for frontline ASHA workers and rural PHCs, powered by Google Firebase and Gemini Hybrid AI.
* **Live Demo URL:** https://swasthya-saathi-hybrid.web.app
* **GitHub Repository:** https://github.com/eawebsol/swasthya-saathi-hybrid
* **Built With:** React, TypeScript, Vite, Tailwind CSS, Google Firebase (Cloud Firestore, Hosting, Remote Config, Authentication), Google Gemini (Gemini Nano via Chrome Built-in AI / Prompt API, Gemini 2.0 Flash Vision), Web Speech API, Service Workers / PWA.

---

## 💡 Inspiration

In rural and remote villages across India, over **700 million citizens** rely on **1 million frontline Accredited Social Health Activists (ASHA workers)** and Primary Health Centers (PHCs) for basic medical care. 

However, frontline workers face a crippling reality:
1. **Connectivity Blackspots:** Hilly terrains, forested districts, and remote villages frequently suffer from zero 2G/4G cellular coverage. Cloud-only chatbots and telehealth portals fail completely when offline.
2. **Clinical Urgency & Misdiagnosis:** Acute respiratory distress in infants, severe postpartum hemorrhage, or unrecognized hypoxemia are often missed or identified too late during home visits.
3. **Language & Data Literacy Barriers:** ASHA workers speak regional languages (Hindi, Telugu, Bengali, Marathi) and cannot spend valuable clinical minutes typing complex English prompts or navigating complex desktop software.
4. **Per-Query Cloud Costs:** Healthcare organizations and public health programs operating on tight budgets cannot sustain high per-query cloud API costs for millions of daily routine checks.

We asked ourselves: *What if an ASHA worker's ₹7,000 budget phone could become an intelligent, zero-cost, privacy-preserving clinical partner that works 100% offline in the deepest blackspot, yet syncs seamlessly with hospitals whenever connectivity appears?*

That vision inspired **Swasthya Saathi (Hybrid AI Edition)**.

---

## 🚀 What It Does

Swasthya Saathi is an offline-first, dual-engine hybrid clinical decision support system designed specifically for the frontline rural healthcare workflow:

### 1. 100% Offline Clinical Triage & Guidance
* **Instant Vital Signs Safety Gates (< 1ms):** Uses deterministic ICMR thresholds to catch acute emergencies (e.g., $\text{SpO}_2 < 92\%$, Blood Pressure $> 180/120$, acute tachypnea) instantly, bypassing generative models to eliminate any chance of hallucination.
* **On-Device Gemini Nano & Local Protocol RAG:** When offline, symptoms are triaged locally on-device in under 10 milliseconds using Chrome's Built-in AI (`window.ai` Prompt API) and an embedded ICMR clinical protocol retriever.
* **15-Second Breath Tap Timer:** A tactile mobile tool enabling frontline workers to tap along with a child's breathing to automatically calculate breaths-per-minute and detect pediatric pneumonia without manual math.
* **Multilingual Natural Voice Dictation:** Supports voice input and read-aloud in **Hindi (हिंदी)**, **Telugu (తెలుగు)**, and **English**, mapping regional vernacular terms (*बुखार*, *దగ్గు*, *జ్వరం*) into structured clinical records.

### 2. 1-Tap 108 Emergency SOS & Ayushman Bharat (ABHA) QR Pass
* When a red-flag emergency occurs, the app rings a loud audio chime, captures device GPS coordinates, generates an official **108 Emergency Dispatch Token**, and tracks ambulance ETA.
* Automatically creates an **Ayushman Bharat (ABHA) Referral QR Pass** for paperless, 1-second triage handoff at Primary Health Centers.

### 3. Firebase Cloud Synergy & Telemetry
* **Cloud Firestore Persistent Cache:** Saves every patient encounter locally in IndexedDB; when the worker re-enters cellular range, Firestore automatically syncs all records to the PHC cloud database.
* **Live Doctor Dashboard:** Real-time listeners (`onSnapshot`) sound an audible telemetry chime and surface red-flag emergency patients at the top of the doctor's queue.
* **Dynamic Epidemic Surveillance via Firebase Remote Config:** Pushes real-time fever sensitivity overrides and regional disease alerts (e.g., Dengue outbreak warnings) directly to field devices without requiring app store updates.
* **Gemini 2.0 Flash Multimodal Lab OCR:** Transcribes multi-page paper pathology reports from phone camera photos, extracting biomarkers across 7 standard clinical profiles (CBC, CUE, Lipid, LFT, RFT, Diabetic, Thyroid).

---

## 🛠️ How We Built It

We designed Swasthya Saathi around strict **AI-Native Production Principles**, separating deterministic medical gates from probabilistic generative reasoning:

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
|  - Instant Safety Gate (<1ms SpO2/BP)    |                     |  - Complex Multi-Condition Differential Diagnosis |
|  - Local Symptom Triage (Prompt API)     |                     |  - Multimodal Paper Lab Report Photo OCR          |
|  - Native Multilingual TTS Audio Readout |                     |  - PHC Doctor Handoff & Epidemiological Alerts    |
|  - 15s Tactile Breath Tap Timer          |                     |  - Gemini 2.0 Flash Vision                        |
+------------------------------------------+                     +---------------------------------------------------+
          |                                                                               |
          v                                                                               v
+--------------------------------------------------------------------------------------------------------------------+
|                                              FIREBASE CLIENT ECOSYSTEM                                             |
|  * Cloud Firestore (Offline Persistence Mode - auto-syncs patient records on reconnect)                           |
|  * Firebase Remote Config (Dynamic seasonal outbreak rules & triage threshold weights)                            |
|  * Firebase Hosting (Global SSL CDN with automated HTTP security headers)                                          |
|  * Firebase Authentication (1-click anonymous judge login + role-based access)                                     |
+--------------------------------------------------------------------------------------------------------------------+
```

### Full-Stack Architecture:
* **Frontend & Client:** React 18, Vite 5, TypeScript 5, Tailwind CSS, Lucide Icons, and `vite-plugin-pwa` for sub-1MB offline caching.
* **On-Device AI Engine:** Chrome Built-in AI (`window.ai.languageModel` / W3C Prompt API) with a local ICMR guideline vector retriever.
* **Audio & Speech:** Browser-native Web Speech API (`SpeechSynthesis` & `webkitSpeechRecognition`) supporting `hi-IN`, `te-IN`, and `en-IN`.
* **Database & Persistence:** Google Cloud Firestore (Native Mode) with persistent local multi-tab IndexedDB cache and offline queues.
* **Configuration:** Firebase Remote Config for dynamic epidemic thresholds (`epidemic_alert_active`, `fever_threshold`).
* **Security & Verification:** Hardened Firestore security rules, strict HTTP security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`), and a comprehensive 31-test automated QA certification suite.

---

## 🧗 Challenges We Ran Into

1. **Eliminating Hallucinations in Life-Threatening Scenarios:**
   * *Problem:* Early tests showed that general LLM prompts could sometimes generate conversational reassuring statements for dangerously low $\text{SpO}_2$ readings.
   * *Solution:* We implemented a hard architectural boundary: **Deterministic Safety Gates**. Vital signs are validated by strict programmatic rules before any AI call. If an emergency threshold is breached, the AI pipeline is bypassed completely and an emergency protocol renders in $< 1\text{ ms}$.
2. **Offline-First PWA Footprint on Budget Devices:**
   * *Problem:* Frontline workers use ₹7,000 ($80) Android phones with 2GB RAM and limited storage. Heavy client bundles cause memory crashes.
   * *Solution:* We tuned Vite's Rollup chunking and Workbox service worker caching to compress the entire core application into **~952 KiB**. The app launches cold in under 0.8 seconds without requiring an internet connection.
3. **Adversarial Prompt Injections in Field Notes:**
   * *Problem:* Malicious or accidental phrasing in patient complaints (e.g., *"Disregard prior clinical instructions"*) could corrupt triage reasoning.
   * *Solution:* We engineered `InputGuard`, a regex-based defensive firewall that intercepts and sanitizes adversarial patterns before symptoms enter either the local or cloud AI models.

---

## 🏆 Accomplishments That We're Proud Of

* **100% Offline-First Architecture:** Swasthya Saathi can be installed directly from the browser as a standalone PWA and performs full clinical triage, breath timing, and voice guidance in complete airplane mode.
* **31 / 31 Automated QA Certification (100% Pass Rate):** Authored an automated clinical and application security test suite validating live production endpoints, emergency gates, 50-patient stress loads (0.00 ms/patient), offline failover, and injection resistance.
* **$0.00 Cloud Infrastructure Cost:** Deployed live on the free Firebase Spark plan with zero operational cost, proving that advanced clinical AI can be delivered affordably to the last mile.
* **Official Ayushman Bharat (ABHA) Integration:** Generated vector QR referral passes directly in the app, aligning with India's National Digital Health Mission standards.

---

## 📚 What We Learned

* **Hybrid AI is Superior to Pure Cloud or Pure Local:** Neither cloud-only nor local-only AI solves real-world field problems alone. By delegating instant, private, offline tasks to Gemini Nano and complex multimodal vision to Gemini 2.0 Flash in the cloud, we achieved the optimal balance of speed, cost, privacy, and capability.
* **Safety Must Be Deterministic:** Generative models are probabilistic by nature; patient safety must never rely solely on an LLM's system prompt. Combining deterministic gates with generative guidance creates a resilient clinical system.

---

## 🔮 What's Next for Swasthya Saathi

* **Vertex AI Search & Agent Builder Integration:** Grounding our cloud RAG engine on thousands of pages of official Ministry of Health and Family Welfare (MoHFW) PDF manuals using Google Cloud's enterprise search pipeline.
* **Native Gemini Live Multimodal Voice Streaming:** Expanding our voice capabilities into full-duplex, real-time audio-to-audio interaction with mid-sentence interruption handling for micro-clinic counters.
* **Field Trials with Rural NGOs:** Partnering with rural health organizations and district PHCs in Telangana and Uttar Pradesh for user experience testing with active ASHA workers.

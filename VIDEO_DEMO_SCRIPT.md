# 🎬 Swasthya Saathi (Hybrid AI Edition) — 3-Minute Video Demo Script
### Google Firebase #BuildHybridAI 2026 Global Hackathon Submission
**Target Duration:** Exactly 180 Seconds (3 Minutes)  
**Live Application URL:** https://swasthya-saathi-hybrid.web.app  
**GitHub Repository:** https://github.com/eawebsol/swasthya-saathi-hybrid  

---

## ⏱️ Video Timeline Overview

| Timestamp | Phase | Scene Focus | Core Message / Demo Action |
| :--- | :--- | :--- | :--- |
| **0:00 - 0:30** | **The Hook** | Real-world problem in rural India | 1M+ ASHA workers, 70% population in rural villages, zero cellular connectivity, delayed triage costs lives. |
| **0:30 - 1:15** | **Offline Hybrid AI Demo** | Airplane mode / Disconnected Wi-Fi | Open app offline (PWA), 15s breath tap timer, voice dictation in Hindi/Telugu, local ICMR RAG triage (<10ms). |
| **1:15 - 1:45** | **Clinical Safety Gates & ABHA** | Deterministic vitals check & QR | Red-flag hypoxia (SpO2 88%), <1ms deterministic emergency screen, 108 ambulance dispatch with GPS, ABHA referral pass. |
| **1:45 - 2:25** | **Cloud Synergy & Multimodal Vision** | Wi-Fi Reconnect & Doctor Telemetry | Firestore auto-syncs patient, Doctor Dashboard sounds real-time chime, Remote Config epidemic banner, Gemini 2.0 Flash Lab OCR. |
| **2:25 - 3:00** | **Architecture & Impact** | Hybrid Inspector HUD & Closing | Zero-data-egress proof, $0.00 infrastructure cost on Firebase free tier, budget ₹7,000 Android Go compatibility. |

---

## 📜 Scene-by-Scene Script & Recording Guide

---

### SCENE 1: The Hook & The Problem (0:00 - 0:30)
* **Visual on Screen:** Title slide with Swasthya Saathi logo, transitioning to photos or b-roll of rural Indian Primary Health Centers and ASHA frontline workers on field visits.
* **Audio / Voiceover:**
> *"In rural India, over 700 million people depend on 1 million frontline ASHA workers for primary healthcare. But in remote villages and hilly terrain, cellular networks simply do not exist. When an ASHA worker encounters a child struggling to breathe or a mother with severe fever, waiting for a cloud-only chatbot to load is not just frustrating—it is fatal.  
> Today, we present **Swasthya Saathi (Hybrid AI Edition)**: an offline-first, multilingual clinical copilot built on Google Firebase and Gemini Hybrid AI that turns any budget phone into an intelligent field clinic."*

---

### SCENE 2: 100% Disconnected Offline Triage (0:30 - 1:15)
* **Visual on Screen:** Screen recording of browser with DevTools Network tab set to **Offline** (or physical phone in Airplane Mode). Open `https://swasthya-saathi-hybrid.web.app`.
* **Action:**
  1. Show app loading instantly from the PWA Service Worker cache (`dist/sw.js`).
  2. Switch language to **हिंदी (Hindi)**.
  3. Click **"Preset 2: Chronic Cough & Sputum (TB)"**.
  4. Tap the **"15-Second Breath Timer"** tool to demonstrate calculating respiratory rate (28 breaths/min) with one-tap tactile pacing.
  5. Click **"Generate Hybrid Triage"**.
* **Audio / Voiceover:**
> *"Notice: Wi-Fi is completely disconnected. Airplane mode is active.  
> As a Progressive Web App under 1MB, Swasthya Saathi launches instantly with zero network.  
> Frontline workers use the built-in 15-second breath tap timer for rapid pediatric pneumonia screening.  
> When we run triage, the local ICMR Clinical Protocol RAG and on-device Gemini Nano evaluate the symptoms locally in just 8 milliseconds. It categorizes the case, flags suspected tuberculosis, prepares an ASHA sputum collection checklist, and links directly to India's National TB Elimination Program (NIKSHAY)."*
* **Visual Highlight:** Click **"मार्गदर्शन सुनें (Listen Guidance)"** to show the browser Web Speech API reading the patient advice aloud in fluent Hindi.

---

### SCENE 3: Deterministic Vitals Gate & 108 Emergency SOS (1:15 - 1:45)
* **Visual on Screen:** Top Preset Bar $\rightarrow$ Click **"Preset 1: Severe Hypoxia Red Flag (SpO2 = 88%)"**.
* **Action:**
  1. The app immediately halts probabilistic AI inference and renders the high-contrast Red Emergency Screen in under 1 millisecond.
  2. The distinct audio alarm chime rings.
  3. Click **"Request 108 Dispatch & Transmit Location"** to show real-time GPS coordinates and ambulance token generation.
  4. Scroll down to show the **Ayushman Bharat (ABHA) Referral QR Pass** with doctor handoff notes.
* **Audio / Voiceover:**
> *"Medical AI must never hallucinate during an emergency. Following clinical safety standards, our system separates deterministic vital checks from generative AI.  
> If SpO2 drops below 92% or systolic blood pressure exceeds 180, an instant sub-millisecond safety gate halts generation and triggers the emergency protocol: an audio alert sounds, 108 ambulance dispatch generates an emergency token with precise GPS coordinates, and an Ayushman Bharat QR referral pass is created for instant hospital intake."*

---

### SCENE 4: Online Cloud Sync, Doctor Telemetry & Multimodal Vision (1:45 - 2:25)
* **Visual on Screen:** Turn network connectivity back **Online** (disable Airplane Mode).
* **Action:**
  1. Show Cloud Firestore automatically flushing offline patient records to the cloud.
  2. Switch role toggle to **"PHC Doctor Dashboard"**.
  3. The pulsing Red Telemetry Alert Bar appears instantly with an audible chime, notifying the doctor of the incoming hypoxia emergency.
  4. Switch to the **"Lab Analyzer"** tab. Click **"Sample CBC (Low Platelets / Dengue)"** or upload a lab photo.
  5. Gemini 2.0 Flash Vision extracts biomarkers and maps thrombocytopenia against Firebase Remote Config's dynamic epidemic threshold.
* **Audio / Voiceover:**
> *"The moment the ASHA worker reaches cellular connectivity, Google Cloud Firestore's persistent local cache automatically syncs the record to the Primary Health Center.  
> On the Doctor's Dashboard, live telemetry alerts sound an emergency chime and surface the patient at the top of the queue.  
> For complex paper reports, our cloud engine leverages Gemini 2.0 Flash Vision to transcribe multi-page lab photos in seconds. Simultaneously, Firebase Remote Config dynamically adapts the diagnostic sensitivity based on active local Dengue or Malaria outbreak alerts without requiring an app store update."*

---

### SCENE 5: Architecture, Privacy & Closing (2:25 - 3:00)
* **Visual on Screen:** Expand the **Hybrid Inspector HUD** at the bottom right. Show:
  * Engine: `Local Protocol RAG / Gemini Nano`
  * Latency: `8ms`
  * Data Egress: `0 Bytes (Privacy Enclave)`
  * Security: Zero XSS, Hardened Firestore Rules.
* **Audio / Voiceover:**
> *"Our Hybrid Inspector HUD proves true privacy: patient vitals and home notes never leave the device unless explicitly synced to the hospital.  
> Best of all: Swasthya Saathi runs entirely within the free Firebase Spark tier at zero dollar per-query cost, optimized for budget ₹7,000 ($80) Android phones with just 2GB of RAM.  
> By uniting Google Firebase with Gemini's hybrid AI capabilities, Swasthya Saathi brings resilient, life-saving clinical intelligence to the last mile of healthcare. Thank you."*
* **Visual on Screen:** End title card with Live URL (`https://swasthya-saathi-hybrid.web.app`), GitHub link, and Team Tekcentrics credits.

---

## 🎥 Recording Tips for Best Judge Impression:
1. **Resolution:** 1080p (1920x1080) at 60fps or 30fps.
2. **Audio:** Clear voiceover with subtle background ambient music (low volume).
3. **Pacing:** Let each transition breathe for 2-3 seconds so judges can read the Indic text and inspect the HUD badges.
4. **Tools:** OBS Studio, Loom, or Windows Game Bar (Win + Alt + R) works well for capturing the screen.

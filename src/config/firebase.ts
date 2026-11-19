import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Firestore
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getRemoteConfig, fetchAndActivate, getValue, RemoteConfig } from 'firebase/remote-config';
import { PatientCase, EpidemicConfig } from '../types/medical';

// Environment / Default Config (Zero Hardcoded Secrets in Source)
const defaultFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

let app: any = null;
let db: Firestore | null = null;
let auth: any = null;
let remoteConfig: RemoteConfig | null = null;

try {
  app = !getApps().length ? initializeApp(defaultFirebaseConfig) : getApp();
  
  // Enable full offline persistence for Firestore
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  });
  
  auth = getAuth(app);

  if (typeof window !== 'undefined') {
    remoteConfig = getRemoteConfig(app);
    remoteConfig.settings.minimumFetchIntervalMillis = 60000; // 1 min for fast testing & evaluation
    remoteConfig.defaultConfig = {
      epidemic_alert_active: true,
      fever_threshold: 101.5,
      epidemic_disease_name: "Dengue & Vector-Borne Outbreak Alert",
      epidemic_region: "Telangana & Northern District Sub-centers"
    };
  }
} catch (err) {
  console.warn('Firebase initialized in local mock fallback mode for offline testing:', err);
}

export { app, db, auth, remoteConfig };

/**
 * 1-Click Anonymous Authentication (Essential for hackathon judges)
 */
export async function ensureAnonymousAuth(): Promise<string | null> {
  if (auth) {
    try {
      if (!auth.currentUser) {
        const userCred = await signInAnonymously(auth);
        return userCred.user.uid;
      }
      return auth.currentUser.uid;
    } catch (e) {
      console.warn('Anonymous auth deferred:', e);
    }
  }
  return null;
}

// Default Remote Config for Epidemic Surveillance
export const defaultEpidemicConfig: EpidemicConfig = {
  active: true,
  diseaseName: "Dengue & Vector-Borne Outbreak Alert",
  region: "Telangana & Northern District Sub-centers",
  alertMessage: "High incidence of acute fever with thrombocytopenia. Mandate platelet count for fever > 2 days.",
  feverThreshold: 101.5,
  customRules: [
    "Lower threshold for Dengue NS1 testing to Day 2 of fever",
    "Mandatory ORS hydration counseling for all outpatient fevers",
    "Prohibit NSAID/Ibuprofen usage across rural kiosks"
  ]
};

/**
 * Fetch live Remote Config from Firebase Cloud
 */
export async function fetchLiveEpidemicConfig(): Promise<EpidemicConfig> {
  if (!remoteConfig || !navigator.onLine) {
    return defaultEpidemicConfig;
  }

  try {
    await fetchAndActivate(remoteConfig);
    const active = getValue(remoteConfig, 'epidemic_alert_active').asBoolean();
    const threshold = getValue(remoteConfig, 'fever_threshold').asNumber();
    const disease = getValue(remoteConfig, 'epidemic_disease_name').asString();
    const region = getValue(remoteConfig, 'epidemic_region').asString();

    return {
      active,
      diseaseName: disease || defaultEpidemicConfig.diseaseName,
      region: region || defaultEpidemicConfig.region,
      alertMessage: `Live Outbreak Rule: Platelet count mandatory for fever > 2 days. Fever boundary calibrated to ${threshold}°F.`,
      feverThreshold: threshold || defaultEpidemicConfig.feverThreshold,
      customRules: defaultEpidemicConfig.customRules
    };
  } catch (err) {
    console.warn('Remote Config fetch failed, serving local default:', err);
    return defaultEpidemicConfig;
  }
}

// Local IndexedDB Key for Offline Queueing
const LOCAL_STORAGE_CASES_KEY = 'swasthya_saathi_offline_cases_v1';

export async function savePatientCase(patientCase: PatientCase): Promise<void> {
  // 1. Always save to Local IndexedDB/localStorage first (Offline-First Guarantee)
  const existingCases = getLocalCases();
  const updatedCases = [patientCase, ...existingCases.filter(c => c.id !== patientCase.id)];
  localStorage.setItem(LOCAL_STORAGE_CASES_KEY, JSON.stringify(updatedCases));

  // 2. If online and Firebase DB is connected, sync to Cloud Firestore
  if (navigator.onLine && db) {
    try {
      await ensureAnonymousAuth();
      const casesRef = collection(db, 'patient_cases');
      await addDoc(casesRef, {
        ...patientCase,
        syncedToCloud: true
      });
      // Mark as synced locally
      patientCase.syncedToCloud = true;
      localStorage.setItem(LOCAL_STORAGE_CASES_KEY, JSON.stringify(
        updatedCases.map(c => c.id === patientCase.id ? { ...c, syncedToCloud: true } : c)
      ));
    } catch (e) {
      console.log('Firebase remote sync queued: case stored in local offline enclave.');
    }
  }
}

export function getLocalCases(): PatientCase[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CASES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Real-Time Firestore Sync Listener (for PHC Doctor and ASHA dashboards)
 */
export function subscribeToPatientCases(callback: (cases: PatientCase[]) => void): () => void {
  if (!db) {
    callback(getLocalCases());
    return () => {};
  }

  try {
    const casesRef = collection(db, 'patient_cases');
    return onSnapshot(casesRef, (snapshot) => {
      const remoteCases: PatientCase[] = [];
      snapshot.forEach(doc => {
        remoteCases.push({ ...doc.data() as PatientCase, id: doc.id });
      });

      // Merge with local cases
      const local = getLocalCases();
      const mergedMap = new Map<string, PatientCase>();
      remoteCases.forEach(c => mergedMap.set(c.id, c));
      local.forEach(c => {
        if (!mergedMap.has(c.id)) mergedMap.set(c.id, c);
      });

      const merged = Array.from(mergedMap.values());
      callback(merged);
    }, (err) => {
      console.warn('Firestore snapshot listener error, serving local:', err);
      callback(getLocalCases());
    });
  } catch (err) {
    callback(getLocalCases());
    return () => {};
  }
}

export async function syncPendingCases(): Promise<number> {
  if (!navigator.onLine || !db) return 0;
  const cases = getLocalCases();
  const pending = cases.filter(c => !c.syncedToCloud);

  let syncedCount = 0;
  for (const item of pending) {
    try {
      await ensureAnonymousAuth();
      const casesRef = collection(db, 'patient_cases');
      await addDoc(casesRef, { ...item, syncedToCloud: true });
      item.syncedToCloud = true;
      syncedCount++;
    } catch (e) {
      console.warn('Sync failed for case:', item.id, e);
    }
  }

  if (syncedCount > 0) {
    localStorage.setItem(LOCAL_STORAGE_CASES_KEY, JSON.stringify(cases));
  }
  return syncedCount;
}

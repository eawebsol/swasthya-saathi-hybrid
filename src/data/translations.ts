import { SupportedLanguage } from '../types/medical';

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  roleAsha: string;
  roleDoctor: string;
  offlineMode: string;
  onlineMode: string;
  simulatedOffline: string;
  navTriage: string;
  navLabReport: string;
  navDashboard: string;
  navKnowledge: string;
  stage1Title: string;
  stage1Desc: string;
  stage2Title: string;
  stage2Desc: string;
  patientDetails: string;
  patientName: string;
  age: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  village: string;
  vitalsSection: string;
  temperature: string;
  pulse: string;
  spo2: string;
  bloodPressure: string;
  emergencyAlertTitle: string;
  emergencyAlertDesc: string;
  callAmbulance: string;
  proceedToStage2: string;
  complaintSelect: string;
  duration: string;
  btnAnalyzeTriage: string;
  triageAnalyzing: string;
  triageComplete: string;
  tierPatientTitle: string;
  tierAshaTitle: string;
  tierDoctorTitle: string;
  playAudio: string;
  stopAudio: string;
  saveCase: string;
  caseSavedSuccess: string;
  labTitle: string;
  labDesc: string;
  pasteReportText: string;
  uploadReportPhoto: string;
  btnAnalyzeReport: string;
  cloudSyncStatus: string;
  synced: string;
  pendingSync: string;
  epidemicAlert: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appTitle: "Swasthya Saathi",
    appSubtitle: "Offline-First Hybrid AI Rural Healthcare & Field Intelligence",
    roleAsha: "ASHA Worker",
    roleDoctor: "PHC Medical Officer",
    offlineMode: "Offline Mode (Local Enclave)",
    onlineMode: "Online (Cloud Sync Active)",
    simulatedOffline: "Simulate Offline Mode",
    navTriage: "Symptom Triage",
    navLabReport: "Lab Analyzer",
    navDashboard: "Field Dashboard",
    navKnowledge: "Clinical Protocols",
    stage1Title: "Stage 1: Vital Signs & Safety Gate",
    stage1Desc: "Enter baseline patient vitals. Critical readings immediately trigger emergency hospital referral.",
    stage2Title: "Stage 2: Guided Symptom Assessment",
    stage2Desc: "Select the primary complaint and answer targeted diagnostic follow-up questions.",
    patientDetails: "Patient Information",
    patientName: "Patient Full Name",
    age: "Age (Years)",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    village: "Village / Hamlet",
    vitalsSection: "Vital Signs",
    temperature: "Temperature (°F)",
    pulse: "Pulse / Heart Rate (bpm)",
    spo2: "Oxygen Saturation (SpO2 %)",
    bloodPressure: "Blood Pressure (Systolic / Diastolic mmHg)",
    emergencyAlertTitle: "CRITICAL EMERGENCY DETECTED",
    emergencyAlertDesc: "Vital parameters indicate acute danger. Immediate ambulance dispatch and hospital referral required.",
    callAmbulance: "Call 108 Emergency Ambulance",
    proceedToStage2: "Vitals Normal. Proceed to Symptom Assessment",
    complaintSelect: "Primary Complaint",
    duration: "Duration of Symptoms",
    btnAnalyzeTriage: "Generate Hybrid Triage Assessment",
    triageAnalyzing: "Analyzing with On-Device AI / Hybrid Engine...",
    triageComplete: "Triage Assessment Complete",
    tierPatientTitle: "Tier 1: Patient Home Guidance (Plain Language)",
    tierAshaTitle: "Tier 2: ASHA Worker Action Checklist",
    tierDoctorTitle: "Tier 3: PHC Medical Summary & Public Health Programs",
    playAudio: "Listen to Guidance (Audio Readout)",
    stopAudio: "Stop Audio",
    saveCase: "Save & Queue Patient Record",
    caseSavedSuccess: "Record saved locally in IndexedDB! Ready for cloud sync.",
    labTitle: "Lab Report & Diagnostic Analyzer",
    labDesc: "Paste laboratory test values or snap a photo of paper reports for instant AI interpretation.",
    pasteReportText: "Paste Lab Report Text (e.g. CBC, Lipid Profile, Sugar)",
    uploadReportPhoto: "Capture or Upload Lab Report Photo",
    btnAnalyzeReport: "Analyze Diagnostic Report",
    cloudSyncStatus: "Cloud Sync Status",
    synced: "Synced to PHC Cloud",
    pendingSync: "Offline: Queued for Sync",
    epidemicAlert: "Active Epidemic Surveillance Alert"
  },
  hi: {
    appTitle: "स्वास्थ्य साथी",
    appSubtitle: "ऑफलाइन-प्रथम हाइब्रिड एआई ग्रामीण स्वास्थ्य ट्रायज प्रणाली",
    roleAsha: "आशा कार्यकर्ता (ASHA)",
    roleDoctor: "प्राथमिक स्वास्थ्य केंद्र डॉक्टर",
    offlineMode: "ऑफलाइन मोड (स्थानीय डिवाइस)",
    onlineMode: "ऑनलाइन (क्लाउड सिंक सक्रिय)",
    simulatedOffline: "ऑफलाइन मोड का परीक्षण करें",
    navTriage: "लक्षण ट्रायज",
    navLabReport: "लैब रिपोर्ट विश्लेषक",
    navDashboard: "फील्ड डैशबोर्ड",
    navKnowledge: "चिकित्सा प्रोटोकॉल",
    stage1Title: "चरण 1: महत्वपूर्ण संकेत (वाइटल्स) और आपातकालीन जांच",
    stage1Desc: "मरीज के वाइटल्स दर्ज करें। यदि रीडिंग अत्यधिक असामान्य है, तो तुरंत अस्पताल रेफरल दिखाया जाएगा।",
    stage2Title: "चरण 2: निर्देशित लक्षण मूल्यांकन",
    stage2Desc: "मुख्य शिकायत चुनें और लक्षित प्रश्नों के उत्तर दें।",
    patientDetails: "मरीज की जानकारी",
    patientName: "मरीज का पूरा नाम",
    age: "उम्र (वर्ष)",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    village: "गाँव / टोला",
    vitalsSection: "शारीरिक महत्वपूर्ण संकेत (Vitals)",
    temperature: "तापमान (°F)",
    pulse: "नाड़ी की गति (Pulse bpm)",
    spo2: "ऑक्सीजन स्तर (SpO2 %)",
    bloodPressure: "रक्तचाप (सिस्टोलिक / डायस्टोलिक mmHg)",
    emergencyAlertTitle: "गंभीर आपातकाल चेतावनी (EMERGENCY)",
    emergencyAlertDesc: "मरीज के वाइटल्स खतरनाक स्तर पर हैं। तुरंत 108 एम्बुलेंस बुलाएं और नजदीकी अस्पताल भेजें।",
    callAmbulance: "108 एम्बुलेंस को कॉल करें",
    proceedToStage2: "वाइटल्स स्थिर हैं। लक्षण मूल्यांकन जारी रखें",
    complaintSelect: "मुख्य शिकायत / समस्या",
    duration: "लक्षणों की अवधि",
    btnAnalyzeTriage: "हाइब्रिड ट्रायज परिणाम प्राप्त करें",
    triageAnalyzing: "ऑन-डिवाइस एआई से विश्लेषण किया जा रहा है...",
    triageComplete: "ट्रायज मूल्यांकन पूर्ण",
    tierPatientTitle: "स्तर 1: मरीज के लिए सरल घरेलू देखभाल निर्देश",
    tierAshaTitle: "स्तर 2: आशा कार्यकर्ता के लिए कार्रवाई चेकलिस्ट",
    tierDoctorTitle: "स्तर 3: प्राथमिक स्वास्थ्य केंद्र (PHC) डॉक्टर के लिए सारांश",
    playAudio: "निर्देश सुनें (ऑडियो गाइड)",
    stopAudio: "ऑडियो बंद करें",
    saveCase: "केस सुरक्षित करें (IndexedDB में)",
    caseSavedSuccess: "मरीज का रिकॉर्ड सुरक्षित हो गया! नेटवर्क मिलने पर क्लाउड से सिंक होगा।",
    labTitle: "लैब रिपोर्ट विश्लेषक",
    labDesc: "लैब टेस्ट के आंकड़े दर्ज करें या पर्चे की फोटो लेकर त्वरित विश्लेषण प्राप्त करें।",
    pasteReportText: "लैब रिपोर्ट का टेक्स्ट यहाँ पेस्ट करें (जैसे CBC, ब्लड शुगर)",
    uploadReportPhoto: "लैब रिपोर्ट की फोटो अपलोड करें",
    btnAnalyzeReport: "रिपोर्ट का विश्लेषण करें",
    cloudSyncStatus: "क्लाउड सिंक स्थिति",
    synced: "क्लाउड पर सिंक हो चुका है",
    pendingSync: "ऑफलाइन: सिंक की प्रतीक्षा में",
    epidemicAlert: "सक्रिय महामारी निगरानी चेतावनी"
  },
  te: {
    appTitle: "స్వాస్థ్య సాథీ",
    appSubtitle: "ఆఫ్‌లైన్-ఫస్ట్ హైబ్రిడ్ AI గ్రామీణ ఆరోగ్య రక్షణ మరియు ట్రయాజ్ వ్యవస్థ",
    roleAsha: "ఆశా కార్యకర్త (ASHA)",
    roleDoctor: "PHC వైద్యాధికారి",
    offlineMode: "ఆఫ్‌లైన్ మోడ్ (స్థానిక పరికరం)",
    onlineMode: "ఆన్‌లైన్ (క్లౌడ్ సింక్ సక్రియం)",
    simulatedOffline: "ఆఫ్‌లైన్ మోడ్ పరీక్షించండి",
    navTriage: "లక్షణాల ట్రయాజ్",
    navLabReport: "ల్యాబ్ రిపోర్ట్ విశ్లేషణ",
    navDashboard: "ఫీల్డ్ డాష్‌బోర్డ్",
    navKnowledge: "క్లినికల్ ప్రోటోకాల్స్",
    stage1Title: "దశ 1: ముఖ్యమైన సంకేతాలు (వైటల్స్) & అత్యవసర తనిఖీ",
    stage1Desc: "రోగి వైటల్స్ నమోదు చేయండి. ప్రమాదకరమైన రీడింగ్‌లు వెంటనే ఆసుపత్రి రెఫరల్ చూపిస్తాయి.",
    stage2Title: "దశ 2: లక్షణాల నిర్ధారణ ప్రశ్నలు",
    stage2Desc: "ప్రధాన సమస్యను ఎంచుకోండి మరియు తదుపరి ప్రశ్నలకు సమాధానం ఇవ్వండి.",
    patientDetails: "రోగి సమాచారం",
    patientName: "రోగి పూర్తి పేరు",
    age: "వయస్సు (సంవత్సరాలు)",
    gender: "లింగం",
    male: "పురుషుడు",
    female: "స్త్రీ",
    other: "ఇతర",
    village: "గ్రామం",
    vitalsSection: "వైటల్ సంకేతాలు",
    temperature: "ఉష్ణోగ్రత (°F)",
    pulse: "నాడి వేగం (Pulse bpm)",
    spo2: "ఆక్సిజన్ స్థాయి (SpO2 %)",
    bloodPressure: "రక్తపోటు (సిస్టోలిక్ / డయాస్టోలిక్ mmHg)",
    emergencyAlertTitle: "తీవ్రమైన అత్యవసర పరిస్థితి (EMERGENCY)",
    emergencyAlertDesc: "రోగి పరిస్థితి ప్రమాదకరంగా ఉంది. వెంటనే 108 అంబులెన్స్ పిలిపించి ఆసుపత్రికి పంపండి.",
    callAmbulance: "108 అంబులెన్స్ కాల్ చేయండి",
    proceedToStage2: "వైటల్స్ సాధారణం. లక్షణాల నమోదుకు వెళ్లండి",
    complaintSelect: "ప్రధాన సమస్య",
    duration: "సమస్య వ్యవధి",
    btnAnalyzeTriage: "హైబ్రిడ్ ట్రయాజ్ విశ్లేషణ ప్రారంభించండి",
    triageAnalyzing: "స్థానిక AI విశ్లేషిస్తోంది...",
    triageComplete: "ట్రయాజ్ విశ్లేషణ పూర్తయింది",
    tierPatientTitle: "స్థాయి 1: రోగికి అర్థమయ్యే గృహ సంరక్షణ సూచనలు",
    tierAshaTitle: "స్థాయి 2: ఆశా కార్యకర్త చేయవలసిన చర్యలు",
    tierDoctorTitle: "స్థాయి 3: PHC వైద్యుల సారాంశం & ప్రభుత్వ ప్రోగ్రామ్స్",
    playAudio: "సూచనలు వినండి (ఆడియో)",
    stopAudio: "ఆడియో ఆపండి",
    saveCase: "కేసును భద్రపరచండి",
    caseSavedSuccess: "రోగి రికార్డు స్థానికంగా సేవ్ అయింది! ఇంటర్నెట్ రాగానే క్లౌడ్ సింక్ అవుతుంది.",
    labTitle: "ల్యాబ్ రిపోర్ట్ విశ్లేషణ",
    labDesc: "రక్త పరీక్ష ఫలితాలు రాయండి లేదా ఫోటో అప్‌లోడ్ చేసి విశ్లేషణ పొందండి.",
    pasteReportText: "ల్యాబ్ రిపోర్ట్ వివరాలు ఇక్కడ పేస్ట్ చేయండి (CBC, రక్తంలో చక్కెర)",
    uploadReportPhoto: "ల్యాబ్ రిపోర్ట్ ఫోటో అప్‌లోడ్ చేయండి",
    btnAnalyzeReport: "రిపోర్ట్ విశ్లేషించండి",
    cloudSyncStatus: "క్లౌడ్ సింక్ స్థితి",
    synced: "క్లౌడ్‌కు సింక్ చేయబడింది",
    pendingSync: "ఆఫ్‌లైన్: సింక్ వేచి ఉంది",
    epidemicAlert: "అంటువ్యాధుల హెచ్చరిక"
  }
};

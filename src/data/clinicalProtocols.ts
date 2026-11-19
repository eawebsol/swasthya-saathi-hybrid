export interface ClinicalProtocol {
  id: string;
  condition: string;
  category: 'respiratory' | 'vector_borne' | 'cardiovascular' | 'gastrointestinal' | 'maternal' | 'ncd' | 'pediatric';
  triggers: string[];
  icmrGuidelines: string;
  ashaActionChecklist: string[];
  homeCareAdvice: {
    en: string;
    hi: string;
    te: string;
  };
  redFlagsToHospital: string[];
  publicHealthProgram: string;
  tier3MedicalNotes: string;
}

export const CLINICAL_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'tb_protocol',
    condition: 'Suspected Tuberculosis (TB)',
    category: 'respiratory',
    triggers: ['cough', 'fever in evening', 'weight loss', 'night sweats', 'blood in sputum', '> 2 weeks'],
    icmrGuidelines: 'ICMR / NTEP Guidelines: Any cough lasting > 14 days, especially with evening fever or unexplained weight loss, requires 2 sputum smear examinations (spot and early morning) or CBNAAT / Truenat testing.',
    ashaActionChecklist: [
      'Collect 2 sputum samples and transport to nearest Designated Microscopy Center (DMC).',
      'Register patient in NIKSHAY portal.',
      'Counsel family members on cough hygiene and mask usage.',
      'Ensure patient does not discontinue treatment if diagnosed.'
    ],
    homeCareAdvice: {
      en: 'Cover your mouth with a cloth while coughing or sneezing. Keep windows open for good ventilation. Eat high-protein foods like dal, milk, or eggs. Do NOT take over-the-counter cough syrups without testing.',
      hi: 'खांसते समय मुंह पर साफ कपड़ा रखें। कमरे की खिड़कियां खुली रखें ताकि ताजी हवा आ सके। दाल, दूध और अंडे जैसी पौष्टिक चीजें खाएं। बिना जांच के मेडिकल स्टोर से खांसी की सिरप न लें।',
      te: 'దగ్గినప్పుడు లేదా తుమ్మినప్పుడు నోటికి గుడ్డ అడ్డు పెట్టుకోండి. గదిలో గాలి వెలుతురు ఉండేలా కిటికీలు తెరిచి ఉంచండి. పప్పు, పాలు వంటి బలవర్ధకమైన ఆహారం తీసుకోండి. పరీక్ష చేయకుండా సిరప్‌లు వాడకండి.'
    },
    redFlagsToHospital: [
      'Coughing up fresh blood (Hemoptysis)',
      'Severe breathlessness at rest',
      'Extreme chest pain'
    ],
    publicHealthProgram: 'National Tuberculosis Elimination Program (NTEP / NIKSHAY / DOTS)',
    tier3MedicalNotes: 'Differential: Sputum microscopy / CBNAAT indicated. Rule out Secondary Bacterial Pneumonia vs Pulmonary Tuberculosis. Baseline weight and chest X-ray recommended at PHC.'
  },
  {
    id: 'dengue_malaria_protocol',
    condition: 'Vector-Borne Disease (Dengue / Malaria / Chikungunya)',
    category: 'vector_borne',
    triggers: ['fever', 'chills', 'rigors', 'severe headache', 'retro-orbital pain', 'body ache', 'rash', 'joint pain'],
    icmrGuidelines: 'NVBDCP / ICMR Guidelines: High fever with chills/rigors indicates Malaria smear/RDT. Severe retro-orbital headache, body ache, or petechial rash warrants Dengue NS1 antigen / IgM test and strict platelet monitoring.',
    ashaActionChecklist: [
      'Perform rapid diagnostic test (RDT) for Malaria (bivalent Pf/Pv).',
      'Prepare peripheral blood smear (thick and thin).',
      'Check for bleeding signs: gums, nose, black stools, skin petechiae.',
      'Ensure strict mosquito net usage for the patient to prevent transmission.'
    ],
    homeCareAdvice: {
      en: 'Drink plenty of fluids: boiled water, coconut water, ORS, or lemon water. Take only Paracetamol for fever; NEVER take Brufen, Aspirin, or pain relievers. Rest completely under a mosquito net.',
      hi: 'खूब पानी, ओआरएस (ORS), नारियल पानी और नींबू पानी पिएं। बुखार के लिए केवल पैरासिटामोल लें; कभी भी ब्रूफेन या एस्पिरिन जैसी दर्द की दवा न लें। हमेशा मच्छरदानी में आराम करें।',
      te: 'ఎక్కువగా ద్రవాలు తాగండి: కాచి చల్లార్చిన నీరు, కొబ్బరి నీళ్ళు, ఓఆర్ఎస్ (ORS). జ్వరానికి పారాసిటమాల్ మాత్రమే వేసుకోండి; బ్రూఫెన్ లేదా ఆస్పిరిన్ ఎప్పుడూ వాడకండి. దోమతెర కింద విశ్రాంతి తీసుకోండి.'
    },
    redFlagsToHospital: [
      'Persistent vomiting or inability to tolerate fluids',
      'Bleeding from nose, gums, or blood in stool/vomit',
      'Severe abdominal pain or extreme lethargy',
      'Cold, clammy skin or sudden drop in temperature with weakness'
    ],
    publicHealthProgram: 'National Vector Borne Disease Control Programme (NVBDCP)',
    tier3MedicalNotes: 'Differential: Dengue Fever vs Plasmodium falciparum/vivax Malaria. Order CBC (Platelets & Hematocrit), Dengue NS1 / IgM, and Peripheral Smear at PHC.'
  },
  {
    id: 'acute_respiratory_pneumonia',
    condition: 'Pneumonia / Acute Respiratory Infection (ARI)',
    category: 'respiratory',
    triggers: ['fast breathing', 'chest indrawing', 'fever', 'cough', 'wheezing', 'difficulty breathing'],
    icmrGuidelines: 'IMNCI & ICMR Guidelines: Fast breathing (> 50 bpm for infants, > 40 bpm for children, > 24 bpm for adults) with fever or chest indrawing indicates Pneumonia. Oxygen saturation < 94% requires immediate medical referral.',
    ashaActionChecklist: [
      'Assess for lower chest indrawing (subcostal retraction) while child is calm.',
      'Administer first pre-referral dose of dispersible Amoxicillin if PHC is > 1 hour away (as per IMNCI protocol).',
      'Keep patient warm, position in upright/semi-reclining posture, and clear nasal passages.',
      'Arrange priority 108 ambulance transport if wheezing, grunting, or SpO2 < 94%.'
    ],
    homeCareAdvice: {
      en: 'Keep the chest warm. Continue feeding and frequent sips of warm water. Keep the room free of smoke (avoid burning wood/chulha inside). Clean the nose if blocked.',
      hi: 'सीने को गर्म रखें। बच्चे को लगातार स्तनपान कराएं या गुनगुना पानी पिलाएं। कमरे में धुआं न होने दें (चूल्हा कमरे से बाहर रखें)। नाक बंद हो तो साफ करें।',
      te: 'ఛాతీకి వెచ్చదనం ఇవ్వండి. పిల్లలకు పాలు మరియు గోరువెచ్చని నీరు అందిస్తూ ఉండండి. గదిలో పొగ లేకుండా చూసుకోండి. ముక్కు మూసుకుపోతే శుభ్రం చేయండి.'
    },
    redFlagsToHospital: [
      'SpO2 below 92%',
      'Chest drawing in deeply when breathing',
      'Inability to drink or breastfeed',
      'Bluish discoloration of lips or fingernails (Cyanosis)'
    ],
    publicHealthProgram: 'Integrated Management of Neonatal and Childhood Illness (IMNCI)',
    tier3MedicalNotes: 'Evaluation for Lower Respiratory Tract Infection. Auscultate for crepitations/rhonchi. Initiate oral Amoxicillin or refer for IV antibiotics based on severity.'
  },
  {
    id: 'cardiac_mi_protocol',
    condition: 'Acute Coronary Syndrome / Myocardial Infarction',
    category: 'cardiovascular',
    triggers: ['chest pain', 'sweating', 'radiating pain', 'left arm pain', 'jaw pain', 'tightness in chest', 'palpitations'],
    icmrGuidelines: 'National NCD Guidelines: Crushing retrosternal chest pain lasting > 15 minutes, radiating to left arm/jaw, accompanied by diaphoresis (cold sweats) or breathlessness, must be treated as acute MI until proven otherwise.',
    ashaActionChecklist: [
      'Seat patient in a comfortable reclining position (Fowlers position).',
      'Do not allow patient to walk or exert physically.',
      'Alert 108 Emergency Ambulance immediately.',
      'Note exact time of pain onset for the receiving hospital (Golden Hour).'
    ],
    homeCareAdvice: {
      en: 'Sit upright and rest completely. Loosen tight clothing around neck and waist. Take slow, deep breaths. Do NOT take gas or digestive medicine hoping it will pass; get to the hospital immediately.',
      hi: 'बिलकुल शांत होकर बैठ जाएं, लेटें नहीं। कपड़े ढीले कर दें। गहरी और धीमी सांसें लें। इसे गैस का दर्द समझकर घरेलू नुस्खे न आजमाएं; तुरंत 108 पर कॉल कर अस्पताल पहुंचें।',
      te: 'ప్రశాంతంగా కూర్చోండి, నడవవద్దు. దుస్తులను వదులు చేయండి. నెమ్మదిగా శ్వాస తీసుకోండి. ఇది గ్యాస్ సమస్య అని భావించి సమయం వృధా చేయకండి; వెంటనే ఆసుపత్రికి వెళ్ళండి.'
    },
    redFlagsToHospital: [
      'Severe crushing chest pain lasting more than 10 minutes',
      'Profuse cold sweating with dizziness or fainting',
      'Pain spreading to left shoulder, arm, or jaw'
    ],
    publicHealthProgram: 'National Programme for Prevention & Control of Cancer, Diabetes, CVD & Stroke (NPCDCS)',
    tier3MedicalNotes: 'Suspected ACS / STEMI. Immediate 12-lead ECG, blood pressure monitoring, Aspirin 300mg / Clopidogrel 300mg loading dose per medical officer protocol.'
  },
  {
    id: 'pediatric_diarrhea_ors',
    condition: 'Acute Diarrheal Disease & Dehydration',
    category: 'pediatric',
    triggers: ['diarrhea', 'loose stools', 'vomiting', 'sunken eyes', 'dry mouth', 'no tears', 'thirst', 'lethargy'],
    icmrGuidelines: 'National Child Health Guidelines: Watery diarrhea requires immediate start of Oral Rehydration Salts (ORS) and Zinc supplementation (20mg daily for 14 days, 10mg for infants < 6 months).',
    ashaActionChecklist: [
      'Demonstrate correct preparation of 1 liter ORS with clean boiled water.',
      'Dispense Zinc dispersible tablets for 14-day full course.',
      'Assess dehydration status (skin pinch test, sunken eyes, fontanelle).',
      'Advise mother to continue breastfeeding without interruption.'
    ],
    homeCareAdvice: {
      en: 'Give ORS after every loose stool. Mix 1 packet in exactly 1 liter of clean water. Continue breastfeeding and soft foods (khichdi, banana, rice kanji). Never give adult anti-diarrhea tablets to children.',
      hi: 'हर बार दस्त होने पर ओआरएस (ORS) का घोल पिलाएं। 1 पैकेट को ठीक 1 लीटर साफ पानी में घोलें। स्तनपान और सुपाच्य भोजन (खिचड़ी, केला, चावल का पानी) जारी रखें। बच्चों को बड़ों की दस्त की दवा न दें।',
      te: 'ప్రతి విరేచనం తర్వాత ఓఆర్ఎస్ (ORS) ద్రావణం తాగించండి. 1 ప్యాకెట్‌ను 1 లీటరు శుభ్రమైన నీటిలో కలపండి. తల్లిపాలు, మెత్తటి ఆహారం (ఖిచ్డీ, అరటిపండు) ఇవ్వండి. పిల్లలకు పెద్దల మందులు ఇవ్వవద్దు.'
    },
    redFlagsToHospital: [
      'Blood or mucus in stools (Dysentery)',
      'Child is too weak to drink or lethargic/unconscious',
      'Persistent vomiting unable to retain any fluid for > 4 hours',
      'High fever with dry tongue and sunken eyes'
    ],
    publicHealthProgram: 'Intensified Diarrhea Control Fortnight (IDCF) / RBSK',
    tier3MedicalNotes: 'Assess for Plan B or Plan C Dehydration. Monitor for electrolyte imbalance. Screen for Shigellosis / Amoebiasis if bloody stool present.'
  },
  {
    id: 'maternal_preeclampsia',
    condition: 'Pregnancy Complication / Pre-Eclampsia',
    category: 'maternal',
    triggers: ['pregnant', 'swelling on face', 'headache in pregnancy', 'blurred vision', 'high bp', 'epigastric pain'],
    icmrGuidelines: 'MCH / PMSMA Guidelines: Blood pressure ≥ 140/90 mmHg in pregnancy after 20 weeks with edema, headache, or visual disturbance indicates Pre-Eclampsia, requiring urgent specialist referral to prevent Eclamptic seizures.',
    ashaActionChecklist: [
      'Measure blood pressure twice 15 minutes apart.',
      'Check for pedal and facial edema.',
      'Inquire about fetal movements in the past 12 hours.',
      'Arrange immediate institutional delivery center / FRU transport.'
    ],
    homeCareAdvice: {
      en: 'Lie on your left side to improve blood flow to the baby. Do not do heavy lifting or stressful chores. Avoid excessive salt. Get your blood pressure checked immediately at the sub-center.',
      hi: 'बाईं करवट लेकर लेटें ताकि बच्चे को रक्त संचार ठीक से मिले। कोई भारी काम या तनाव न लें। खाने में अतिरिक्त नमक न लें। तुरंत स्वास्थ्य केंद्र जाकर बीपी चेक कराएं।',
      te: 'ఎడమవైపు తిరిగి పడుకోండి, దీనివల్ల బిడ్డకు రక్తప్రసరణ బాగా జరుగుతుంది. బరువులు ఎత్తవద్దు. ఉప్పు తగ్గించండి. వెంటనే సబ్-సెంటర్‌కు వెళ్లి బీపీ తనిఖీ చేయించుకోండి.'
    },
    redFlagsToHospital: [
      'Severe throbbing headache not relieved by rest',
      'Blurred vision, double vision, or flashing lights',
      'Severe pain below the ribs on the right side',
      'Decreased or absent movements of the baby'
    ],
    publicHealthProgram: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA) / JSY',
    tier3MedicalNotes: 'Pre-Eclampsia screening. Urine albumin dipstick test. If BP > 160/110, emergency MgSO4 loading dose and urgent referral to First Referral Unit (FRU).'
  }
];

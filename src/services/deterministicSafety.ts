import { Vitals, EmergencyCheckResult } from '../types/medical';

export function evaluateEmergencyVitals(vitals: Vitals): EmergencyCheckResult {
  const { temperature, pulse, spo2, bpSystolic, bpDiastolic, respiratoryRate } = vitals;

  // 1. Oxygen Saturation (SpO2)
  if (spo2 > 0 && spo2 < 92) {
    return {
      isEmergency: true,
      vitalTriggered: `Oxygen Saturation (SpO2): ${spo2}% (Normal: ≥ 95%)`,
      reason: 'Severe Hypoxemia - Immediate risk of respiratory failure.',
      recommendedAction: 'Administer emergency high-flow oxygen, maintain airway, and transfer immediately via 108 Ambulance.'
    };
  }

  // 1b. Respiratory Rate - Extreme Tachypnea or Bradypnea
  if (respiratoryRate !== undefined && respiratoryRate > 0) {
    if (respiratoryRate >= 36) {
      return {
        isEmergency: true,
        vitalTriggered: `Respiratory Rate: ${respiratoryRate} breaths/min (Severe Tachypnea)`,
        reason: 'Acute Respiratory Distress / Impending Respiratory Exhaustion.',
        recommendedAction: 'Position patient upright, keep airway clear, loosen tight clothing, and call 108 Ambulance immediately.'
      };
    }
    if (respiratoryRate <= 8) {
      return {
        isEmergency: true,
        vitalTriggered: `Respiratory Rate: ${respiratoryRate} breaths/min (Critical Bradypnea / Hypoventilation)`,
        reason: 'Central Respiratory Depression / Imminent Respiratory Arrest.',
        recommendedAction: 'Stimulate breathing, check airway patency, prepare bag-valve-mask if trained, and rush to emergency care.'
      };
    }
  }

  // 2. Body Temperature - Hyperpyrexia
  if (temperature >= 104.0) {
    return {
      isEmergency: true,
      vitalTriggered: `Body Temperature: ${temperature}°F (Danger threshold: ≥ 104°F)`,
      reason: 'Hyperpyrexia - High risk of febrile seizures, organ damage, or severe sepsis.',
      recommendedAction: 'Immediate cold tepid water sponging, paracetamol suppositories if available, and emergency hospital referral.'
    };
  }

  // 2b. Body Temperature - Severe Hypothermia
  if (temperature > 0 && temperature < 95.0) {
    return {
      isEmergency: true,
      vitalTriggered: `Body Temperature: ${temperature}°F (Critical Hypothermia: < 95°F)`,
      reason: 'Severe Hypothermia - Critical risk of metabolic collapse, cold shock, or neonatal sepsis.',
      recommendedAction: 'Immediate skin-to-skin kangaroo mother care (if infant) or warm blanket wrap, warm fluids if conscious, and urgent medical transport.'
    };
  }

  // 3. Blood Pressure - Hypertensive Crisis
  if (bpSystolic >= 180 || bpDiastolic >= 120) {
    return {
      isEmergency: true,
      vitalTriggered: `Blood Pressure: ${bpSystolic}/${bpDiastolic} mmHg (Hypertensive Crisis)`,
      reason: 'Hypertensive Emergency - Imminent risk of intracranial hemorrhage (Stroke), aortic dissection, or acute pulmonary edema.',
      recommendedAction: 'Keep patient calm in semi-reclining position, avoid sudden standing, and arrange urgent medical officer intervention.'
    };
  }

  // 4. Blood Pressure - Severe Hypotension / Shock
  if (bpSystolic > 0 && bpSystolic < 80) {
    return {
      isEmergency: true,
      vitalTriggered: `Blood Pressure: ${bpSystolic}/${bpDiastolic} mmHg (Severe Hypotension)`,
      reason: 'Circulatory Collapse / Shock (Septic, Hypovolemic, or Cardiogenic).',
      recommendedAction: 'Elevate legs (Trendelenburg position), establish IV line if trained, and rush to emergency care.'
    };
  }

  // 5. Heart Rate / Pulse
  if (pulse >= 140) {
    return {
      isEmergency: true,
      vitalTriggered: `Heart Rate: ${pulse} bpm (Severe Tachycardia)`,
      reason: 'Severe Tachycardia / Cardiac Arrhythmia / Severe Sepsis.',
      recommendedAction: 'Immediate ECG and medical officer evaluation at primary health center.'
    };
  }

  if (pulse > 0 && pulse <= 42) {
    return {
      isEmergency: true,
      vitalTriggered: `Heart Rate: ${pulse} bpm (Severe Bradycardia)`,
      reason: 'Critical Bradycardia / Complete Heart Block risk.',
      recommendedAction: 'Immediate hospital transfer with vital sign monitoring.'
    };
  }

  return {
    isEmergency: false,
    reason: 'Vitals are within stable or non-emergency triage range.',
    recommendedAction: 'Proceed to symptom assessment questionnaire.'
  };
}

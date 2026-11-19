export interface InputValidationResult {
  isValid: boolean;
  sanitizedText: string;
  rejectionReason?: string;
  isInjectionAttempt?: boolean;
}

export class InputGuard {
  // Known prompt injection and jailbreak signatures
  private static readonly INJECTION_PATTERNS = [
    /ignore (?:all )?(?:previous|above|prior) (?:instructions|rules|prompts)/i,
    /disregard (?:all )?(?:previous|above|prior )?(?:instructions|rules|prompts)/i,
    /system (?:prompt|override|command)/i,
    /jailbreak/i,
    /\bDAN\b (?:mode)?/i,
    /you are now (?:an? unrestricted|a hacker|a criminal)/i,
    /act as an? (?:unrestricted|evil|unfiltered)/i,
    /repeat (?:the|your) (?:system )?prompt/i,
    /<script\b[^>]*>/i,
    /javascript:/i,
    /drop (?:table|database)/i
  ];

  // Core clinical keywords across complaints and vitals
  private static readonly MEDICAL_KEYWORDS = [
    'fever', 'cough', 'cold', 'pain', 'chest', 'breath', 'breathing', 'headache',
    'vomiting', 'diarrhea', 'loose motion', 'weakness', 'dizziness', 'chills',
    'sputum', 'blood', 'rash', 'swelling', 'sugar', 'pressure', 'bp', 'spo2',
    'pulse', 'temperature', 'pregnant', 'bleeding', 'delivery', 'convulsion',
    'hb', 'hemoglobin', 'wbc', 'platelet', 'creatinine', 'urea', 'esr', 'bilirubin',
    'cholesterol', 'tsh', 'thyroid', 'urine', 'infection', 'asthma', 'tb',
    'tuberculosis', 'malaria', 'dengue', 'typhoid', 'pneumonia', 'cardiac',
    'बुखार', 'खांसी', 'दर्द', 'सांस', 'दस्त', 'उल्टी', 'सिरदर्द', 'कमजोरी',
    'జ్వరం', 'దగ్గు', 'నొప్పి', 'శ్వాస', 'విరేచనాలు', 'వాంతులు', 'నీరసం'
  ];

  /**
   * Validate and sanitize freeform text input
   */
  public static validateClinicalInput(rawText: string): InputValidationResult {
    if (!rawText || !rawText.trim()) {
      return {
        isValid: false,
        sanitizedText: '',
        rejectionReason: 'Input cannot be empty.'
      };
    }

    // 1. Sanitize text: strip dangerous tags and normalize whitespace
    const sanitized = rawText
      .replace(/<[^>]*>?/gm, '') // Remove HTML tags
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove ASCII control characters
      .trim();

    // 2. Check for Prompt Injection / Adversarial patterns
    for (const pattern of this.INJECTION_PATTERNS) {
      if (pattern.test(sanitized)) {
        return {
          isValid: false,
          sanitizedText: sanitized,
          isInjectionAttempt: true,
          rejectionReason: 'Security alert: Adversarial prompt manipulation pattern detected.'
        };
      }
    }

    // 3. Clinical relevance check for lab reports or complaints
    const lower = sanitized.toLowerCase();
    const hasMedicalSignal = this.MEDICAL_KEYWORDS.some(kw => lower.includes(kw));
    const hasLabMeasurement = /[0-9]+(?:\.[0-9]+)?\s*(?:g\/dl|mg\/dl|\/µl|%|mm\/hr|bpm|°f|mmhg)/i.test(sanitized);

    if (!hasMedicalSignal && !hasLabMeasurement && sanitized.length > 5) {
      // Check if it's pure gibberish like "asdfghjk 12345"
      const nonAlphanumericRatio = (sanitized.match(/[^a-zA-Z0-9\s]/g) || []).length / sanitized.length;
      if (nonAlphanumericRatio > 0.4) {
        return {
          isValid: false,
          sanitizedText: sanitized,
          rejectionReason: 'Input appears to contain random gibberish or invalid characters.'
        };
      }
    }

    return {
      isValid: true,
      sanitizedText: sanitized
    };
  }
}

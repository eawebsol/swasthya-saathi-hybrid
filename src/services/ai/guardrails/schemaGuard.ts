import { TriageResult, LabReportResult } from '../../../types/medical';

export interface SchemaValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  repaired: boolean;
}

export class SchemaGuard {
  /**
   * Safely extract JSON from raw LLM text (handling markdown code fences, leading text, etc.)
   */
  public static extractJson<T>(rawText: string): SchemaValidationResult<T> {
    if (!rawText || !rawText.trim()) {
      return { success: false, error: 'Empty completion text', repaired: false };
    }

    let cleaned = rawText.trim();
    let repaired = false;

    // Remove markdown code fences if present
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      repaired = true;
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      repaired = true;
    }

    // Find JSON block if surrounded by conversational filler
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      repaired = true;
    }

    try {
      const parsed = JSON.parse(cleaned);
      return {
        success: true,
        data: parsed as T,
        repaired
      };
    } catch (err: any) {
      return {
        success: false,
        error: `JSON parse failed: ${err.message}`,
        repaired
      };
    }
  }

  /**
   * Validate TriageResult structure
   */
  public static validateTriageResult(data: any): data is TriageResult {
    if (!data || typeof data !== 'object') return false;
    const validUrgencies = ['EMERGENCY', 'HIGH_PRIORITY', 'STANDARD', 'ROUTINE'];
    if (!validUrgencies.includes(data.urgency)) return false;
    if (!Array.isArray(data.possibleCauses)) return false;
    if (typeof data.patientGuidance !== 'string' || !data.patientGuidance.trim()) return false;
    if (!Array.isArray(data.ashaNotes)) return false;
    if (!data.medicalSummary || typeof data.medicalSummary !== 'object') return false;
    return true;
  }

  /**
   * Validate LabReportResult structure
   */
  public static validateLabReportResult(data: any): data is LabReportResult {
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(data.keyFindings)) return false;
    if (typeof data.summary !== 'string') return false;
    if (!Array.isArray(data.dietaryRecommendations)) return false;
    if (!Array.isArray(data.lifestyleRecommendations)) return false;
    return true;
  }
}

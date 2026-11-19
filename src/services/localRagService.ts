import { CLINICAL_PROTOCOLS, ClinicalProtocol } from '../data/clinicalProtocols';
import { SymptomAssessment, Vitals, SupportedLanguage } from '../types/medical';

export interface RetrievedContext {
  matchedProtocols: ClinicalProtocol[];
  guidelinesSummary: string;
  suggestedHomeCare: string;
  ashaActions: string[];
  publicHealthPrograms: string[];
}

export function retrieveLocalClinicalKnowledge(
  symptoms: SymptomAssessment,
  vitals: Vitals,
  age: number,
  language: SupportedLanguage
): RetrievedContext {
  const queryTokens = [
    symptoms.complaint.toLowerCase(),
    symptoms.duration.toLowerCase(),
    ...(symptoms.otherNotes ? symptoms.otherNotes.toLowerCase().split(/\s+/) : []),
    ...Object.values(symptoms.answers).map(a => a.toLowerCase())
  ];

  const matched = CLINICAL_PROTOCOLS.filter(protocol => {
    // Match triggers against query tokens
    const triggerMatch = protocol.triggers.some(trigger =>
      queryTokens.some(token => token.includes(trigger.toLowerCase()) || trigger.toLowerCase().includes(token))
    );

    // Contextual condition matches
    if (symptoms.complaint.toLowerCase().includes('cough') && protocol.category === 'respiratory') return true;
    if (symptoms.complaint.toLowerCase().includes('fever') && (protocol.category === 'vector_borne' || protocol.category === 'respiratory')) return true;
    if (symptoms.complaint.toLowerCase().includes('chest') && protocol.category === 'cardiovascular') return true;
    if (symptoms.complaint.toLowerCase().includes('diarrhea') && protocol.category === 'pediatric') return true;
    if (queryTokens.includes('pregnant') && protocol.category === 'maternal') return true;

    return triggerMatch;
  });

  // If no specific match, fallback to the top relevant protocol by complaint
  const activeProtocols = matched.length > 0 ? matched : [CLINICAL_PROTOCOLS[0]];

  const homeCare = activeProtocols
    .map(p => p.homeCareAdvice[language] || p.homeCareAdvice.en)
    .join('\n\n');

  const ashaActions = Array.from(
    new Set(activeProtocols.flatMap(p => p.ashaActionChecklist))
  );

  const programs = Array.from(
    new Set(activeProtocols.map(p => p.publicHealthProgram))
  );

  const guidelinesSummary = activeProtocols
    .map(p => `[${p.condition}]: ${p.icmrGuidelines}`)
    .join('\n\n');

  return {
    matchedProtocols: activeProtocols,
    guidelinesSummary,
    suggestedHomeCare: homeCare,
    ashaActions,
    publicHealthPrograms: programs
  };
}

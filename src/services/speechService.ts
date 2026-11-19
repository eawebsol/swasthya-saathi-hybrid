import { SupportedLanguage } from '../types/medical';

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(
    text: string,
    language: SupportedLanguage,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported on this device/browser.');
      return;
    }

    this.stop();

    // Map language to BCP-47 language tag
    const langTag = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langTag;
    utterance.rate = 0.9; // Slightly slower for clear rural health understanding
    utterance.pitch = 1.0;

    // Try finding the best voice for the language
    const voices = this.synth.getVoices();
    const voice = voices.find(v => v.lang.startsWith(langTag) || v.lang.startsWith(language));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();

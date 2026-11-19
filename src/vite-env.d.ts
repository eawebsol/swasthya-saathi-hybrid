/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface Window {
  ai?: {
    languageModel?: {
      capabilities: () => Promise<{ available: 'readily' | 'after-download' | 'no' }>;
      create: (options?: any) => Promise<{
        prompt: (text: string) => Promise<string>;
        promptStreaming?: (text: string) => AsyncIterable<string>;
        destroy?: () => void;
      }>;
    };
  };
}

export type ABVariant = 'variant_a' | 'variant_b' | 'side_by_side';

export interface ABExperimentConfig {
  experimentId: string;
  experimentName: string;
  activeVariant: ABVariant;
  variants: {
    variant_a: {
      name: 'Variant A: Standard ICMR Protocol',
      description: 'Standard national health guidelines with baseline emergency thresholds.',
      spo2EmergencyThreshold: 92,
      feverAlertThreshold: 104.0,
      dengueFeverDaysAlert: 3,
      uiMode: 'standard'
    };
    variant_b: {
      name: 'Variant B: Epidemic Outbreak Surge (Monsoon)',
      description: 'Heightened sensitivity protocol with early Dengue/Malaria testing and tighter SpO2 margins.',
      spo2EmergencyThreshold: 94,
      feverAlertThreshold: 102.5,
      dengueFeverDaysAlert: 1,
      uiMode: 'high_sensitivity'
    };
  };
}

export const defaultABConfig: ABExperimentConfig = {
  experimentId: 'exp_rural_triage_monsoon_2026',
  experimentName: 'Firebase Remote Config: Monsoon Outbreak Triage Sensitivity',
  activeVariant: 'variant_a',
  variants: {
    variant_a: {
      name: 'Variant A: Standard ICMR Protocol',
      description: 'Standard national health guidelines with baseline emergency thresholds.',
      spo2EmergencyThreshold: 92,
      feverAlertThreshold: 104.0,
      dengueFeverDaysAlert: 3,
      uiMode: 'standard'
    },
    variant_b: {
      name: 'Variant B: Epidemic Outbreak Surge (Monsoon)',
      description: 'Heightened sensitivity protocol with early Dengue/Malaria testing and tighter SpO2 margins.',
      spo2EmergencyThreshold: 94,
      feverAlertThreshold: 102.5,
      dengueFeverDaysAlert: 1,
      uiMode: 'high_sensitivity'
    }
  }
};

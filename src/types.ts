export interface Medicine {
  name: string;
  dosage: string;
  timing: string;
  slots: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  purpose: string;
  foodWarning?: string;
  usageAlert?: string;
  caution?: string;
}

export interface Tabs {
  medicationList: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  criticalSafetyAlerts: string[];
  usageAlerts: string[];
  warningsAndCautions: string[];
  actionableItems: {
    findPharmacyText: string;
    shareCaregiverText: string;
  };
}

export interface PrescriptionResult {
  rescanRequired?: boolean;
  medicines: Medicine[];
  interactions: {
    severity: 'High' | 'Medium' | 'Low';
    drugs: string[];
    description: string;
  }[];
  generalWarnings: string[];
  usageAlerts: string[];
  warningsAndCautions: string[];
  tabs?: Tabs;
}

export type Lang = 'en' | 'hi' | 'mr';

export interface UserProfile {
  allergies: string[];
  isPregnant: boolean;
  isElderly: boolean;
  isChild: boolean;
  isAdult: boolean;
}
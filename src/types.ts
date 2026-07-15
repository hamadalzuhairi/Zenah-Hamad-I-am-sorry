/**
 * Types and interfaces for the Interactive Apology Letter
 */

export type SincerityLevel = 'sweet' | 'sincere' | 'melodramatic';

export interface ApologyState {
  girlfriendName: string;
  senderName: string;
  reason: string;
  customReason: string;
  sincerityLevel: SincerityLevel;
  customMessage: string;
  isForgiven: boolean;
  forgivenessAttempts: number;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  icon: string;
  code: string;
  isRedeemed: boolean;
  redeemedAt?: string;
}

export interface Flower {
  id: string;
  name: string;
  color: string;
  meaning: string;
  symbol: string;
  textColor: string;
  bgColor: string;
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  emoji: string;
  image?: string;
}

export interface LoveReason {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

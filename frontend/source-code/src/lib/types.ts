export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription: Subscription;
  scores: ScoreEntry[];
  charityId: string;
  charityPercent: number;
  joinedAt: string;
}

export interface Subscription {
  id: string;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'inactive' | 'cancelled';
  amount: number;
  renewalDate: string;
  startDate: string;
}

export interface ScoreEntry {
  id: string;
  date: string;
  score: number;
  course?: string;
}

export interface Draw {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'live' | 'completed';
  prizePool: number;
  jackpotRollover: number;
  tiers: DrawTier[];
  winningNumbers?: number[];
}

export interface DrawTier {
  matches: number;
  prize: number;
  winners: number;
}

export interface DrawResult {
  drawId: string;
  drawName: string;
  date: string;
  userNumbers: number[];
  winningNumbers: number[];
  matchedCount: number;
  tier: number | null;
  prize: number;
  status: 'pending' | 'verified' | 'paid';
}

export interface Charity {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  region: string;
  imageUrl: string;
  totalRaised: number;
  isSpotlight: boolean;
  quote?: string;
}

export interface WinnerSubmission {
  id: string;
  userId: string;
  userName: string;
  drawId: string;
  drawName: string;
  tier: number;
  prize: number;
  proofUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedAt: string;
  verifiedAt?: string;
  paidAt?: string;
}

export interface AdminKPI {
  label: string;
  value: string;
  change: number;
  trend: { label: string; value: number }[];
}

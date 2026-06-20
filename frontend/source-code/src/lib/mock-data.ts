import type { User, Draw, Charity, DrawResult, WinnerSubmission, AdminKPI } from './types';

export const mockCharities: Charity[] = [
  {
    id: 'c1',
    name: 'Ocean Conservancy Trust',
    description: 'Protecting marine ecosystems through science-backed conservation, community engagement, and policy advocacy. Since 2003, we have restored over 12,000 hectares of coral reef and mangrove habitat across the Pacific and Indian Oceans.',
    shortDescription: 'Restoring marine ecosystems worldwide.',
    category: 'Environment',
    region: 'Global',
    imageUrl: 'https://images.unsplash.com/photo-1583212272226-b7c5e687c1b6?w=800&q=80&auto=format&fit=crop',
    totalRaised: 284500,
    isSpotlight: true,
    quote: 'Every round you play helps us breathe life back into our oceans.'
  },
  {
    id: 'c2',
    name: 'Youth Links Foundation',
    description: 'Providing mentorship, education resources, and career pathways for underprivileged youth in urban communities. Our programs have supported over 8,000 young people into further education and meaningful employment.',
    shortDescription: 'Mentoring the next generation of leaders.',
    category: 'Education',
    region: 'North America',
    imageUrl: 'https://images.unsplash.com/photo-1529390079861-591de45a3b09?w=800&q=80&auto=format&fit=crop',
    totalRaised: 156200,
    isSpotlight: false
  },
  {
    id: 'c3',
    name: 'Hearts & Hands Medical',
    description: 'Delivering free surgical care and medical training in underserved regions across Sub-Saharan Africa and Southeast Asia. Our volunteer surgeon teams have performed over 15,000 life-changing procedures.',
    shortDescription: 'Free surgical care where it\'s needed most.',
    category: 'Health',
    region: 'Africa',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80&auto=format&fit=crop',
    totalRaised: 412800,
    isSpotlight: false
  },
  {
    id: 'c4',
    name: 'Green Canopy Project',
    description: 'Urban reforestation initiative planting native trees in cities to reduce heat islands, improve air quality, and create green spaces for communities. Over 500,000 trees planted across 40 cities.',
    shortDescription: 'Planting trees, cooling cities.',
    category: 'Environment',
    region: 'Europe',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80&auto=format&fit=crop',
    totalRaised: 98400,
    isSpotlight: false
  },
  {
    id: 'c5',
    name: 'Safe Harbour Rescue',
    description: 'Emergency disaster relief and long-term community rebuilding. We deploy rapid-response teams within 48 hours and stay for the long haul — average community recovery time reduced by 35%.',
    shortDescription: 'Rapid disaster relief and rebuilding.',
    category: 'Humanitarian',
    region: 'Global',
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80&auto=format&fit=crop',
    totalRaised: 327100,
    isSpotlight: false
  },
  {
    id: 'c6',
    name: 'Paws & Peace Shelter',
    description: 'Operating no-kill animal shelters and running community animal welfare programs. We have rehomed over 20,000 animals and provide low-cost veterinary care to families in need.',
    shortDescription: 'Rescuing animals, strengthening communities.',
    category: 'Animals',
    region: 'North America',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80&auto=format&fit=crop',
    totalRaised: 73600,
    isSpotlight: false
  }
];

export const mockUser: User = {
  id: 'u1',
  name: 'Jordan Mitchell',
  email: 'jordan@example.com',
  subscription: {
    id: 'sub1',
    plan: 'monthly',
    status: 'active',
    amount: 25,
    renewalDate: '2026-07-20',
    startDate: '2025-11-20'
  },
  scores: [
    { id: 's1', date: '2026-06-15', score: 34, course: 'Royal Dornoch' },
    { id: 's2', date: '2026-06-08', score: 28, course: 'Muirfield' },
    { id: 's3', date: '2026-06-01', score: 38, course: 'North Berwick' },
    { id: 's4', date: '2026-05-25', score: 31, course: 'Gullane' },
    { id: 's5', date: '2026-05-18', score: 42, course: 'Luffness New' }
  ],
  charityId: 'c1',
  charityPercent: 15,
  joinedAt: '2025-11-20'
};

export const mockDraws: Draw[] = [
  {
    id: 'd1',
    name: 'June 2026 Draw',
    date: '2026-06-30',
    status: 'upcoming',
    prizePool: 12500,
    jackpotRollover: 3200,
    tiers: [
      { matches: 5, prize: 8000, winners: 0 },
      { matches: 4, prize: 500, winners: 0 },
      { matches: 3, prize: 50, winners: 0 }
    ]
  },
  {
    id: 'd2',
    name: 'May 2026 Draw',
    date: '2026-05-31',
    status: 'completed',
    prizePool: 11800,
    jackpotRollover: 0,
    winningNumbers: [34, 28, 38, 31, 42],
    tiers: [
      { matches: 5, prize: 7200, winners: 0 },
      { matches: 4, prize: 450, winners: 2 },
      { matches: 3, prize: 50, winners: 18 }
    ]
  },
  {
    id: 'd3',
    name: 'April 2026 Draw',
    date: '2026-04-30',
    status: 'completed',
    prizePool: 10200,
    jackpotRollover: 0,
    winningNumbers: [22, 35, 18, 41, 29],
    tiers: [
      { matches: 5, prize: 6100, winners: 1 },
      { matches: 4, prize: 380, winners: 3 },
      { matches: 3, prize: 50, winners: 22 }
    ]
  },
  {
    id: 'd4',
    name: 'March 2026 Draw',
    date: '2026-03-31',
    status: 'completed',
    prizePool: 9800,
    jackpotRollover: 2400,
    winningNumbers: [15, 39, 27, 33, 44],
    tiers: [
      { matches: 5, prize: 5800, winners: 0 },
      { matches: 4, prize: 360, winners: 1 },
      { matches: 3, prize: 50, winners: 14 }
    ]
  }
];

export const mockDrawResults: DrawResult[] = [
  {
    drawId: 'd2',
    drawName: 'May 2026 Draw',
    date: '2026-05-31',
    userNumbers: [34, 28, 38, 31, 42],
    winningNumbers: [34, 28, 38, 31, 42],
    matchedCount: 5,
    tier: null,
    prize: 0,
    status: 'pending'
  },
  {
    drawId: 'd3',
    drawName: 'April 2026 Draw',
    date: '2026-04-30',
    userNumbers: [22, 35, 18, 41, 29],
    winningNumbers: [22, 35, 18, 41, 29],
    matchedCount: 5,
    tier: 5,
    prize: 6100,
    status: 'paid'
  },
  {
    drawId: 'd4',
    drawName: 'March 2026 Draw',
    date: '2026-03-31',
    userNumbers: [19, 33, 27, 40, 12],
    winningNumbers: [15, 39, 27, 33, 44],
    matchedCount: 2,
    tier: null,
    prize: 0,
    status: 'pending'
  }
];

export const mockWinners: WinnerSubmission[] = [
  {
    id: 'w1',
    userId: 'u3',
    userName: 'Sarah Chen',
    drawId: 'd3',
    drawName: 'April 2026 Draw',
    tier: 5,
    prize: 6100,
    proofUrl: '',
    status: 'paid',
    submittedAt: '2026-05-01',
    verifiedAt: '2026-05-03',
    paidAt: '2026-05-05'
  },
  {
    id: 'w2',
    userId: 'u7',
    userName: 'Marcus Webb',
    drawId: 'd2',
    drawName: 'May 2026 Draw',
    tier: 4,
    prize: 450,
    proofUrl: '',
    status: 'approved',
    submittedAt: '2026-06-01',
    verifiedAt: '2026-06-03'
  },
  {
    id: 'w3',
    userId: 'u12',
    userName: 'Priya Sharma',
    drawId: 'd2',
    drawName: 'May 2026 Draw',
    tier: 4,
    prize: 450,
    proofUrl: '',
    status: 'pending',
    submittedAt: '2026-06-02'
  },
  {
    id: 'w4',
    userId: 'u1',
    userName: 'Jordan Mitchell',
    drawId: 'd2',
    drawName: 'May 2026 Draw',
    tier: 5,
    prize: 0,
    proofUrl: '',
    status: 'pending',
    submittedAt: '2026-06-01'
  }
];

export const mockAdminKPIs: AdminKPI[] = [
  {
    label: 'Total Subscribers',
    value: '2,847',
    change: 12.4,
    trend: [
      { label: 'Jan', value: 2100 }, { label: 'Feb', value: 2250 },
      { label: 'Mar', value: 2380 }, { label: 'Apr', value: 2510 },
      { label: 'May', value: 2690 }, { label: 'Jun', value: 2847 }
    ]
  },
  {
    label: 'Prize Pool (YTD)',
    value: '£68,400',
    change: 8.2,
    trend: [
      { label: 'Jan', value: 9200 }, { label: 'Feb', value: 10100 },
      { label: 'Mar', value: 9800 }, { label: 'Apr', value: 10200 },
      { label: 'May', value: 11800 }, { label: 'Jun', value: 12500 }
    ]
  },
  {
    label: 'Charity Contributions',
    value: '£41,200',
    change: 15.7,
    trend: [
      { label: 'Jan', value: 5400 }, { label: 'Feb', value: 6100 },
      { label: 'Mar', value: 6300 }, { label: 'Apr', value: 6800 },
      { label: 'May', value: 7800 }, { label: 'Jun', value: 8800 }
    ]
  },
  {
    label: 'Active Draws',
    value: '1',
    change: 0,
    trend: [
      { label: 'Jan', value: 1 }, { label: 'Feb', value: 1 },
      { label: 'Mar', value: 1 }, { label: 'Apr', value: 1 },
      { label: 'May', value: 1 }, { label: 'Jun', value: 1 }
    ]
  }
];

export const mockRecentWinners = [
  { name: 'Sarah C.', amount: 6100, charity: 'Hearts & Hands Medical', draw: 'April 2026' },
  { name: 'Tom B.', amount: 450, charity: 'Ocean Conservancy Trust', draw: 'May 2026' },
  { name: 'Marcus W.', amount: 450, charity: 'Youth Links Foundation', draw: 'May 2026' },
  { name: 'Elena R.', amount: 50, charity: 'Green Canopy Project', draw: 'May 2026' },
  { name: 'James K.', amount: 50, charity: 'Safe Harbour Rescue', draw: 'May 2026' },
  { name: 'Aisha M.', amount: 50, charity: 'Paws & Peace Shelter', draw: 'April 2026' },
];

export const mockUsers = [
  { id: 'u1', name: 'Jordan Mitchell', email: 'jordan@example.com', plan: 'monthly', status: 'active', joined: '2025-11-20', scores: 5, charity: 'Ocean Conservancy Trust' },
  { id: 'u2', name: 'Alice Freeman', email: 'alice@example.com', plan: 'yearly', status: 'active', joined: '2025-09-14', scores: 5, charity: 'Youth Links Foundation' },
  { id: 'u3', name: 'Sarah Chen', email: 'sarah@example.com', plan: 'monthly', status: 'active', joined: '2025-12-01', scores: 4, charity: 'Hearts & Hands Medical' },
  { id: 'u4', name: 'David Okafor', email: 'david@example.com', plan: 'monthly', status: 'cancelled', joined: '2026-01-10', scores: 3, charity: 'Green Canopy Project' },
  { id: 'u5', name: 'Emma Larsson', email: 'emma@example.com', plan: 'yearly', status: 'active', joined: '2025-10-05', scores: 5, charity: 'Safe Harbour Rescue' },
  { id: 'u6', name: 'Raj Patel', email: 'raj@example.com', plan: 'monthly', status: 'active', joined: '2026-02-18', scores: 2, charity: 'Ocean Conservancy Trust' },
  { id: 'u7', name: 'Marcus Webb', email: 'marcus@example.com', plan: 'monthly', status: 'active', joined: '2025-11-30', scores: 5, charity: 'Youth Links Foundation' },
  { id: 'u8', name: 'Yuki Tanaka', email: 'yuki@example.com', plan: 'yearly', status: 'active', joined: '2026-01-22', scores: 5, charity: 'Paws & Peace Shelter' },
  { id: 'u9', name: 'Clara Novak', email: 'clara@example.com', plan: 'monthly', status: 'inactive', joined: '2026-03-08', scores: 1, charity: 'Hearts & Hands Medical' },
  { id: 'u10', name: 'Ben Torres', email: 'ben@example.com', plan: 'monthly', status: 'active', joined: '2026-04-12', scores: 3, charity: 'Safe Harbour Rescue' },
];

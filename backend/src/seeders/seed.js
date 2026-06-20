/**
 * Database Seeder
 * Seeds the database with initial data based on the frontend mock data.
 * Run: node src/seeders/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Score = require('../models/Score.model');
const Charity = require('../models/Charity.model');
const Draw = require('../models/Draw.model');
const Winner = require('../models/Winner.model');
const Subscription = require('../models/Subscription.model');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
};

const charities = [
  {
    name: 'Ocean Conservancy Trust',
    slug: 'ocean-conservancy-trust',
    description: 'We protect the ocean by cleaning coastlines, fighting plastic pollution, and advocating for marine life. Every contribution goes directly toward beach clean-ups, education programmes, and lobbying for cleaner seas.',
    shortDescription: 'Protecting our oceans one beach at a time.',
    category: 'environment',
    isFeatured: true,
    isActive: true,
    country: 'GB',
    tags: ['ocean', 'environment', 'marine', 'clean-up'],
    totalContributed: 48200,
    totalSubscribers: 42,
    events: [
      {
        title: 'Annual Golf Day for the Oceans',
        date: new Date('2026-08-15'),
        description: 'Join us for a charity golf day at Sunningdale Golf Club. All proceeds support our beach clean-up initiative.',
        location: 'Sunningdale Golf Club, Berkshire',
      },
    ],
  },
  {
    name: 'Youth Links Foundation',
    slug: 'youth-links-foundation',
    description: 'Youth Links Foundation brings golf into underserved communities, providing equipment, coaching, and mental health support to young people aged 8–18. We believe sport changes lives.',
    shortDescription: 'Bringing golf to young people everywhere.',
    category: 'youth',
    isFeatured: false,
    isActive: true,
    country: 'GB',
    tags: ['youth', 'sport', 'golf', 'mental-health', 'education'],
    totalContributed: 32100,
    totalSubscribers: 35,
  },
  {
    name: 'Hearts & Hands Medical',
    slug: 'hearts-and-hands-medical',
    description: 'Hearts & Hands Medical delivers critical healthcare to remote communities across sub-Saharan Africa and South Asia. From mobile clinics to emergency surgery funds, your contribution directly saves lives.',
    shortDescription: 'Life-saving healthcare where it is needed most.',
    category: 'medical',
    isFeatured: false,
    isActive: true,
    country: 'GB',
    tags: ['medical', 'healthcare', 'africa', 'asia', 'emergency'],
    totalContributed: 67500,
    totalSubscribers: 58,
  },
  {
    name: 'Green Canopy Project',
    slug: 'green-canopy-project',
    description: 'The Green Canopy Project plants trees in deforested regions around the world, working with local communities to restore ecosystems and fight climate change. Over 500,000 trees planted so far.',
    shortDescription: 'Replanting forests, restoring ecosystems.',
    category: 'environment',
    isFeatured: false,
    isActive: true,
    country: 'GB',
    tags: ['trees', 'environment', 'climate', 'reforestation'],
    totalContributed: 19800,
    totalSubscribers: 27,
  },
  {
    name: 'Safe Harbour Rescue',
    slug: 'safe-harbour-rescue',
    description: 'Safe Harbour Rescue provides emergency shelter, legal aid, and resettlement support to refugees and asylum seekers arriving in the UK. We believe everyone deserves safety and dignity.',
    shortDescription: 'Rapid disaster relief and rebuilding.',
    category: 'humanitarian',
    isFeatured: false,
    isActive: true,
    country: 'GB',
    tags: ['refugees', 'humanitarian', 'shelter', 'legal-aid'],
    totalContributed: 41300,
    totalSubscribers: 31,
  },
  {
    name: 'Paws & Peace Shelter',
    slug: 'paws-and-peace-shelter',
    description: 'Paws & Peace Shelter rescues abandoned and abused animals, providing veterinary care, rehabilitation, and rehoming services. We advocate for stricter animal welfare laws and responsible pet ownership.',
    shortDescription: 'Rescuing and rehoming animals in need.',
    category: 'animal-welfare',
    isFeatured: false,
    isActive: true,
    country: 'GB',
    tags: ['animals', 'rescue', 'shelter', 'welfare'],
    totalContributed: 12700,
    totalSubscribers: 19,
  },
];

const users = [
  {
    firstName: 'Admin',
    lastName: 'Alfred',
    email: 'admin@alfred.golf',
    password: 'Admin@1234',
    role: 'admin',
    isActive: true,
    isEmailVerified: true,
    subscription: { plan: null, status: null },
  },
  {
    firstName: 'Jordan',
    lastName: 'Mitchell',
    email: 'jordan@example.com',
    password: 'Password@123',
    role: 'subscriber',
    isActive: true,
    isEmailVerified: true,
    charityPercent: 15,
    subscription: {
      plan: 'monthly',
      status: 'active',
      amount: 2500,
      renewalDate: new Date('2026-07-20'),
    },
  },
  {
    firstName: 'Alice',
    lastName: 'Freeman',
    email: 'alice@example.com',
    password: 'Password@123',
    role: 'subscriber',
    isActive: true,
    isEmailVerified: true,
    charityPercent: 20,
    subscription: {
      plan: 'yearly',
      status: 'active',
      amount: 25000,
      renewalDate: new Date('2026-09-14'),
    },
  },
  {
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah@example.com',
    password: 'Password@123',
    role: 'subscriber',
    isActive: true,
    isEmailVerified: true,
    charityPercent: 15,
    subscription: {
      plan: 'monthly',
      status: 'active',
      amount: 2500,
      renewalDate: new Date('2026-07-01'),
    },
  },
  {
    firstName: 'David',
    lastName: 'Okafor',
    email: 'david@example.com',
    password: 'Password@123',
    role: 'subscriber',
    isActive: true,
    isEmailVerified: true,
    charityPercent: 10,
    subscription: {
      plan: 'monthly',
      status: 'cancelled',
      amount: 2500,
    },
  },
  {
    firstName: 'Emma',
    lastName: 'Larsson',
    email: 'emma@example.com',
    password: 'Password@123',
    role: 'subscriber',
    isActive: true,
    isEmailVerified: true,
    charityPercent: 15,
    subscription: {
      plan: 'yearly',
      status: 'active',
      amount: 25000,
      renewalDate: new Date('2026-10-05'),
    },
  },
  {
    firstName: 'Raj',
    lastName: 'Patel',
    email: 'raj@example.com',
    password: 'Password@123',
    role: 'subscriber',
    isActive: true,
    isEmailVerified: true,
    charityPercent: 15,
    subscription: {
      plan: 'monthly',
      status: 'active',
      amount: 2500,
      renewalDate: new Date('2026-07-18'),
    },
  },
  {
    firstName: 'Marcus',
    lastName: 'Webb',
    email: 'marcus@example.com',
    password: 'Password@123',
    role: 'subscriber',
    isActive: true,
    isEmailVerified: true,
    charityPercent: 15,
    subscription: {
      plan: 'monthly',
      status: 'active',
      amount: 2500,
      renewalDate: new Date('2026-06-30'),
    },
  },
  {
    firstName: 'Yuki',
    lastName: 'Tanaka',
    email: 'yuki@example.com',
    password: 'Password@123',
    role: 'subscriber',
    isActive: true,
    isEmailVerified: true,
    charityPercent: 25,
    subscription: {
      plan: 'yearly',
      status: 'active',
      amount: 25000,
      renewalDate: new Date('2027-01-22'),
    },
  },
];

async function seed() {
  try {
    await connectDB();

    // Clear existing data (dev only)
    if (process.env.NODE_ENV !== 'production') {
      console.log('🧹 Clearing existing data...');
      await Promise.all([
        User.deleteMany({}),
        Score.deleteMany({}),
        Charity.deleteMany({}),
        Draw.deleteMany({}),
        Winner.deleteMany({}),
        Subscription.deleteMany({}),
      ]);
    }

    // Seed charities
    console.log('🌱 Seeding charities...');
    const createdCharities = await Charity.insertMany(charities);
    const charityMap = {};
    for (const c of createdCharities) {
      charityMap[c.name] = c._id;
    }

    // Map charity names for users
    const userCharityMap = {
      'Jordan Mitchell': 'Ocean Conservancy Trust',
      'Alice Freeman': 'Youth Links Foundation',
      'Sarah Chen': 'Hearts & Hands Medical',
      'David Okafor': 'Green Canopy Project',
      'Emma Larsson': 'Safe Harbour Rescue',
      'Raj Patel': 'Ocean Conservancy Trust',
      'Marcus Webb': 'Youth Links Foundation',
      'Yuki Tanaka': 'Paws & Peace Shelter',
    };

    // Seed users
    console.log('🌱 Seeding users...');
    const createdUsers = [];
    for (const userData of users) {
      const fullName = `${userData.firstName} ${userData.lastName}`;
      const charityName = userCharityMap[fullName];
      if (charityName) userData.charityId = charityMap[charityName];

      const user = await User.create(userData);
      createdUsers.push(user);
    }

    // Seed subscriptions for active subscribers
    console.log('🌱 Seeding subscriptions...');
    for (const user of createdUsers) {
      if (user.subscription?.status) {
        await Subscription.create({
          userId: user._id,
          plan: user.subscription.plan,
          status: user.subscription.status,
          amount: user.subscription.amount || 2500,
          startDate: new Date(user.createdAt || Date.now()),
          renewalDate: user.subscription.renewalDate,
          billingHistory: user.subscription.status === 'active' ? [
            { date: new Date(), amount: user.subscription.amount || 2500, status: 'paid', description: 'Initial subscription' },
          ] : [],
        });
      }
    }

    // Seed scores for subscriber users
    console.log('🌱 Seeding scores...');
    const subscriberUsers = createdUsers.filter((u) => u.role === 'subscriber');
    
    const scoreData = {
      'Jordan Mitchell': [
        { date: '2026-06-15', score: 34, course: 'Royal Dornoch' },
        { date: '2026-06-08', score: 28, course: 'Muirfield' },
        { date: '2026-06-01', score: 38, course: 'North Berwick' },
        { date: '2026-05-25', score: 31, course: 'Gullane' },
        { date: '2026-05-18', score: 42, course: 'Luffness New' },
      ],
      'Alice Freeman': [
        { date: '2026-06-14', score: 36, course: 'St Andrews Old' },
        { date: '2026-06-07', score: 29, course: 'Carnoustie' },
        { date: '2026-05-31', score: 40, course: 'Gleneagles' },
        { date: '2026-05-24', score: 33, course: 'Prestwick' },
        { date: '2026-05-17', score: 38, course: 'Turnberry' },
      ],
      'Sarah Chen': [
        { date: '2026-06-13', score: 31, course: 'Wentworth' },
        { date: '2026-06-06', score: 25, course: 'Sunningdale' },
        { date: '2026-05-30', score: 37, course: 'Royal Birkdale' },
        { date: '2026-05-23', score: 29, course: 'Hoylake' },
      ],
      'Emma Larsson': [
        { date: '2026-06-12', score: 39, course: 'Royal Troon' },
        { date: '2026-06-05', score: 32, course: 'Western Gailes' },
        { date: '2026-05-29', score: 41, course: 'Dundonald' },
        { date: '2026-05-22', score: 35, course: 'Loch Lomond' },
        { date: '2026-05-15', score: 28, course: 'Kingsbarns' },
      ],
      'Marcus Webb': [
        { date: '2026-06-11', score: 27, course: 'Royal St Georges' },
        { date: '2026-06-04', score: 33, course: 'Prince\'s Golf Club' },
        { date: '2026-05-28', score: 44, course: 'North Foreland' },
        { date: '2026-05-21', score: 30, course: 'Sandwich Bay' },
        { date: '2026-05-14', score: 36, course: 'Royal Cinque Ports' },
      ],
    };

    for (const user of subscriberUsers) {
      const fullName = `${user.firstName} ${user.lastName}`;
      const scores = scoreData[fullName];
      if (scores) {
        for (const s of scores) {
          try {
            await Score.create({
              userId: user._id,
              date: new Date(s.date),
              score: s.score,
              course: s.course,
            });
          } catch (err) {
            // Skip duplicate errors
          }
        }
      }
    }

    // Seed draws
    console.log('🌱 Seeding draws...');
    const draws = [
      {
        name: 'March 2026 Draw',
        month: 3, year: 2026,
        scheduledDate: new Date('2026-03-31'),
        status: 'published',
        winningNumbers: [15, 27, 33, 39, 44],
        publishedAt: new Date('2026-03-31'),
        totalPrizePool: 85000,
        jackpotPool: 34000,
        secondTierPool: 29750,
        thirdTierPool: 21250,
        participantCount: 45,
        winners: { tier5: { count: 0, prizeEach: 0 }, tier4: { count: 2, prizeEach: 14875 }, tier3: { count: 8, prizeEach: 2656 } },
      },
      {
        name: 'April 2026 Draw',
        month: 4, year: 2026,
        scheduledDate: new Date('2026-04-30'),
        status: 'published',
        winningNumbers: [22, 29, 35, 41, 18],
        publishedAt: new Date('2026-04-30'),
        totalPrizePool: 89000,
        jackpotPool: 35600,
        secondTierPool: 31150,
        thirdTierPool: 22250,
        jackpotRollover: 34000, // Rolled over from March
        participantCount: 52,
        winners: { tier5: { count: 1, prizeEach: 69600 }, tier4: { count: 3, prizeEach: 10383 }, tier3: { count: 12, prizeEach: 1854 } },
      },
      {
        name: 'May 2026 Draw',
        month: 5, year: 2026,
        scheduledDate: new Date('2026-05-31'),
        status: 'published',
        winningNumbers: [28, 31, 34, 38, 42],
        publishedAt: new Date('2026-05-31'),
        totalPrizePool: 92000,
        jackpotPool: 36800,
        secondTierPool: 32200,
        thirdTierPool: 23000,
        participantCount: 58,
        winners: { tier5: { count: 0, prizeEach: 0 }, tier4: { count: 2, prizeEach: 16100 }, tier3: { count: 15, prizeEach: 1533 } },
      },
      {
        name: 'June 2026 Draw',
        month: 6, year: 2026,
        scheduledDate: new Date('2026-06-30'),
        status: 'upcoming',
        jackpotRollover: 36800, // Rolled over from May
        totalPrizePool: 0,
        participantCount: 0,
      },
    ];

    const createdDraws = await Draw.insertMany(draws);

    // Seed winners
    console.log('🌱 Seeding winners...');
    const jordanUser = createdUsers.find((u) => u.firstName === 'Jordan');
    const sarahUser = createdUsers.find((u) => u.firstName === 'Sarah');
    const marcusUser = createdUsers.find((u) => u.firstName === 'Marcus');

    const aprilDraw = createdDraws.find((d) => d.month === 4);
    const mayDraw = createdDraws.find((d) => d.month === 5);

    if (sarahUser && aprilDraw) {
      await Winner.create({
        userId: sarahUser._id,
        drawId: aprilDraw._id,
        userName: 'Sarah Chen',
        userEmail: sarahUser.email,
        drawName: aprilDraw.name,
        drawDate: aprilDraw.scheduledDate,
        tier: 5,
        userNumbers: [22, 29, 35, 41, 18],
        winningNumbers: [22, 29, 35, 41, 18],
        matchedNumbers: [22, 29, 35, 41, 18],
        prize: 610000, // £6,100 in pence
        status: 'paid',
        verifiedAt: new Date('2026-05-03'),
        paidAt: new Date('2026-05-05'),
        paymentReference: 'PAY-APRIL-001',
      });
    }

    if (marcusUser && mayDraw) {
      await Winner.create({
        userId: marcusUser._id,
        drawId: mayDraw._id,
        userName: 'Marcus Webb',
        userEmail: marcusUser.email,
        drawName: mayDraw.name,
        drawDate: mayDraw.scheduledDate,
        tier: 4,
        userNumbers: [27, 31, 34, 44, 36],
        winningNumbers: [28, 31, 34, 38, 42],
        matchedNumbers: [31, 34],
        prize: 45000, // £450 in pence
        status: 'approved',
        proofUrl: '',
        verifiedAt: new Date('2026-06-03'),
      });
    }

    if (jordanUser && mayDraw) {
      await Winner.create({
        userId: jordanUser._id,
        drawId: mayDraw._id,
        userName: 'Jordan Mitchell',
        userEmail: jordanUser.email,
        drawName: mayDraw.name,
        drawDate: mayDraw.scheduledDate,
        tier: 5,
        userNumbers: [34, 28, 38, 31, 42],
        winningNumbers: [28, 31, 34, 38, 42],
        matchedNumbers: [28, 31, 34, 38, 42],
        prize: 0, // Jackpot rolled over (no tier-5 winner)
        status: 'pending',
      });
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Credentials:');
    console.log('  Admin:      admin@alfred.golf / Admin@1234');
    console.log('  Subscriber: jordan@example.com / Password@123');
    console.log('  Subscriber: alice@example.com / Password@123');
    console.log('\n🌐 API runs on: http://localhost:5000');
    console.log('📊 Frontend:   http://localhost:3000');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();

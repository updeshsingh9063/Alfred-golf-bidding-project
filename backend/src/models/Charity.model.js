const mongoose = require('mongoose');

const charityEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: String,
  location: String,
  imageUrl: String,
});

const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Charity name is required'],
      trim: true,
      maxlength: [100, 'Charity name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    category: {
      type: String,
      enum: [
        'medical',
        'environment',
        'youth',
        'animal-welfare',
        'humanitarian',
        'education',
        'community',
        'other',
      ],
      required: true,
    },
    logoUrl: String,
    bannerUrl: String,
    images: [String],
    website: String,
    registrationNumber: String,
    // Contribution stats (updated by cron/webhooks)
    totalContributed: { type: Number, default: 0 }, // in pence
    totalSubscribers: { type: Number, default: 0 },
    // Upcoming golf events associated with this charity
    events: [charityEventSchema],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    country: { type: String, default: 'GB' },
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Auto-generate slug from name ──────────────────────────────────────────────
charitySchema.pre('save', function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

charitySchema.index({ isFeatured: 1, isActive: 1 });
charitySchema.index({ category: 1 });
charitySchema.index({ name: 'text', description: 'text', tags: 'text' });

const Charity = mongoose.model('Charity', charitySchema);
module.exports = Charity;

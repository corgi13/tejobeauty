import mongoose, { Document, Schema } from "mongoose";

// LoyaltyTier interface
export interface ILoyaltyTier extends Document {
  name: string;
  nameEN?: string;
  nameDE?: string;
  nameIT?: string;
  minSpent: number;
  discount: number;
  color: string;
  benefits: string[];
  benefitsEN?: string[];
  benefitsDE?: string[];
  benefitsIT?: string[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// LoyaltyTier schema
const LoyaltyTierSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nameEN: {
      type: String,
      trim: true,
    },
    nameDE: {
      type: String,
      trim: true,
    },
    nameIT: {
      type: String,
      trim: true,
    },
    minSpent: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    color: {
      type: String,
      required: true,
    },
    benefits: [
      {
        type: String,
        required: true,
      },
    ],
    benefitsEN: [
      {
        type: String,
      },
    ],
    benefitsDE: [
      {
        type: String,
      },
    ],
    benefitsIT: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Create indexes
LoyaltyTierSchema.index({ name: 1 }, { unique: true });
LoyaltyTierSchema.index({ minSpent: 1 });
LoyaltyTierSchema.index({ order: 1 });
LoyaltyTierSchema.index({ isActive: 1 });

// Static method to get tier by points
LoyaltyTierSchema.statics.getTierByPoints = async function (points: number) {
  const tiers = await this.find({ isActive: true }).sort({ minSpent: -1 });

  for (const tier of tiers) {
    if (points >= tier.minSpent) {
      return tier;
    }
  }

  // If no tier matches, return the lowest tier
  return tiers[tiers.length - 1];
};

// Static method to get next tier
LoyaltyTierSchema.statics.getNextTier = async function (
  currentTierName: string,
) {
  const currentTier = await this.findOne({ name: currentTierName });

  if (!currentTier) {
    return null;
  }

  return this.findOne({
    isActive: true,
    minSpent: { $gt: currentTier.minSpent },
  }).sort({ minSpent: 1 });
};

// Export the model
export default mongoose.model<ILoyaltyTier>("LoyaltyTier", LoyaltyTierSchema);

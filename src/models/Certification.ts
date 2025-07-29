import mongoose, { Document, Schema } from "mongoose";
import mongoose, { Document, Schema } from "mongoose";

export enum CertificationType {
  EU_ECOLABEL = "EU_ECOLABEL",
  LEAPING_BUNNY = "LEAPING_BUNNY",
  CARBON_NEUTRAL = "CARBON_NEUTRAL",
}

export interface ICertification extends Document {
  name: string;
  type: CertificationType;
  description: string;
  iconUrl: string;
  colorCode: string;
  lastVerified: Date;
  apiSource: string;
}

const CertificationSchema = new Schema<ICertification>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(CertificationType),
      required: true,
    },
    description: { type: String, required: true },
    iconUrl: { type: String, required: true },
    colorCode: { type: String, required: true },
    lastVerified: { type: Date, default: Date.now },
    apiSource: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ICertification>(
  "Certification",
  CertificationSchema,
);
// Certification interface
export interface ICertification extends Document {
  name: string;
  nameEN?: string;
  nameDE?: string;
  nameIT?: string;
  code: string;
  type: "eco" | "cruelty-free" | "carbon-neutral" | "other";
  description?: string;
  descriptionEN?: string;
  descriptionDE?: string;
  descriptionIT?: string;
  icon?: string;
  color: string;
  isActive: boolean;
  euEcatId?: string;
  verificationUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Certification schema
const CertificationSchema: Schema = new Schema(
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
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["eco", "cruelty-free", "carbon-neutral", "other"],
      default: "other",
    },
    description: {
      type: String,
    },
    descriptionEN: {
      type: String,
    },
    descriptionDE: {
      type: String,
    },
    descriptionIT: {
      type: String,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
      required: true,
      default: "#4CAF50", // Default green color
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    euEcatId: {
      type: String,
      sparse: true,
    },
    verificationUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Create indexes
CertificationSchema.index({ name: 1 }, { unique: true });
CertificationSchema.index({ code: 1 }, { unique: true });
CertificationSchema.index({ type: 1 });
CertificationSchema.index({ isActive: 1 });
CertificationSchema.index({ euEcatId: 1 }, { sparse: true });

// Export the model
export default mongoose.model<ICertification>(
  "Certification",
  CertificationSchema,
);

import crypto from "crypto";

import mongoose, { Document, Schema } from "mongoose";

// User interface
export interface IUser extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  role: "customer" | "professional" | "admin";
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  loyaltyPoints: number;
  loyaltyTier: string;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  setPassword(password: string): void;
  validatePassword(password: string): boolean;
  generateVerificationToken(): string;
  generatePasswordResetToken(): string;
}

// User schema
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    role: {
      type: String,
      enum: ["customer", "professional", "admin"],
      default: "customer",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    lastLogin: { type: Date },
    loyaltyPoints: { type: Number, default: 0 },
    loyaltyTier: { type: String, default: "Bronze" },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Method to set password
UserSchema.methods.setPassword = function (password: string): void {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

// Method to validate password
UserSchema.methods.validatePassword = function (password: string): boolean {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.password === hash;
};

// Method to generate verification token
UserSchema.methods.generateVerificationToken = function (): string {
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = token;
  return token;
};

// Method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function (): string {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = token;
  this.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  return token;
};

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ loyaltyTier: 1 });

// Export the model
export default mongoose.model<IUser>("User", UserSchema);

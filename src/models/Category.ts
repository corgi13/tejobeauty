import mongoose, { Document, Schema } from "mongoose";

// Category interface
export interface ICategory extends Document {
  name: string;
  nameEN?: string;
  nameDE?: string;
  nameIT?: string;
  slug: string;
  description?: string;
  descriptionEN?: string;
  descriptionDE?: string;
  descriptionIT?: string;
  parent?: mongoose.Types.ObjectId;
  image?: string;
  icon?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Category schema
const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    image: {
      type: String,
    },
    icon: {
      type: String,
    },
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
CategorySchema.index({ name: 1 });
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ isActive: 1 });
CategorySchema.index({ order: 1 });

// Pre-save hook to generate slug if not provided
CategorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Export the model
export default mongoose.model<ICategory>("Category", CategorySchema);

import mongoose, { Document, Schema } from "mongoose";

// Product interface
export interface IProduct extends Document {
  name: string;
  nameEN?: string;
  nameDE?: string;
  nameIT?: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock: number;
  professionalOnly: boolean;
  colors?: string[];
  image: string;
  description: string;
  descriptionEN?: string;
  descriptionDE?: string;
  descriptionIT?: string;
  sku?: string;
  certifications?: mongoose.Types.ObjectId[];
  isSustainable: boolean;
  sustainabilityScore?: number;
  carbonFootprint?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product schema
const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    nameEN: { type: String },
    nameDE: { type: String },
    nameIT: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    professionalOnly: { type: Boolean, default: false },
    colors: [{ type: String }],
    image: { type: String, required: true },
    description: { type: String, required: true },
    descriptionEN: { type: String },
    descriptionDE: { type: String },
    descriptionIT: { type: String },
    sku: { type: String, unique: true, sparse: true },
    certifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Certification",
      },
    ],
    isSustainable: {
      type: Boolean,
      default: false,
      index: true,
    },
    sustainabilityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    carbonFootprint: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Create text index for search
ProductSchema.index(
  {
    name: "text",
    nameEN: "text",
    nameDE: "text",
    nameIT: "text",
    description: "text",
    descriptionEN: "text",
    descriptionDE: "text",
    descriptionIT: "text",
    brand: "text",
    category: "text",
  },
  {
    weights: {
      name: 10,
      nameEN: 10,
      nameDE: 10,
      nameIT: 10,
      brand: 5,
      category: 5,
      description: 3,
      descriptionEN: 3,
      descriptionDE: 3,
      descriptionIT: 3,
    },
    name: "product_text_index",
  },
);

// Export the model
export default mongoose.model<IProduct>("Product", ProductSchema);

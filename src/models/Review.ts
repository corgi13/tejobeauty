import mongoose, { Document, Schema } from "mongoose";

// Review interface
export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  isApproved: boolean;
  isReported: boolean;
  reportReason?: string;
  adminResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review schema
const ReviewSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    reportReason: {
      type: String,
    },
    adminResponse: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Create indexes
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ isApproved: 1 });
ReviewSchema.index({ isReported: 1 });

// Static method to calculate average rating for a product
ReviewSchema.statics.calculateAverageRating = async function (
  productId: mongoose.Types.ObjectId,
) {
  const result = await this.aggregate([
    {
      $match: {
        product: productId,
        isApproved: true,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  // Update the product with the new average rating and review count
  if (result.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      rating: Math.round(result[0].averageRating * 10) / 10, // Round to 1 decimal place
      reviews: result[0].numReviews,
    });
  } else {
    // No reviews, reset to default values
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      rating: 0,
      reviews: 0,
    });
  }
};

// Call calculateAverageRating after save
ReviewSchema.post("save", async function (this: IReview) {
  await (this.constructor as typeof ReviewModel).calculateAverageRating(
    this.product,
  );
});

// Call calculateAverageRating after findOneAndUpdate
ReviewSchema.post("findOneAndUpdate", async function (doc: IReview) {
  if (doc) {
    await (doc.constructor as typeof ReviewModel).calculateAverageRating(
      doc.product,
    );
  }
});

// Call calculateAverageRating after findOneAndDelete
ReviewSchema.post("findOneAndDelete", async function (doc: IReview) {
  if (doc) {
    await (doc.constructor as typeof ReviewModel).calculateAverageRating(
      doc.product,
    );
  }
});

// Create the model as a variable for type assertion above
const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);

// Export the model
export default ReviewModel;

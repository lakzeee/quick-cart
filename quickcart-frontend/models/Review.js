import { model, models, Schema } from "mongoose";

const ReviewSchema = new Schema(
  {
    userEmail: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number },
    title: { type: String },
    content: { type: String },
  },
  { timestamps: true }
);

export const Review = models?.Review || model("Review", ReviewSchema);

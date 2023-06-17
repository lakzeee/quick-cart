import mongooseConnect from "@/lib/mongoose";
import { Review } from "@/models/Review";
import { Types } from "mongoose";

export default async function handler(req, res) {
  await mongooseConnect();
  switch (req.method) {
    case "GET":
      try {
        const { userEmail, productId } = req.query;
        const convertedProductId = new Types.ObjectId(productId);

        const query = { productId: convertedProductId };
        if (userEmail) {
          query.userEmail = userEmail;
        }

        const existingReview = await Review.findOne(query);

        if (existingReview) {
          res.status(200).json({ success: true, data: existingReview });
        } else {
          res.json({ success: false, error: "Review not found" });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "POST":
      try {
        const { userEmail, productId } = req.body;
        const existingReview = await Review.findOne({ userEmail, productId });
        if (existingReview) {
          const updatedReview = await Review.findByIdAndUpdate(
            existingReview._id,
            req.body,
            { new: true, runValidators: true }
          );

          res.status(200).json({ success: true, data: updatedReview });
        } else {
          const newReview = await Review.create(req.body);
          res.status(201).json({ success: true, data: newReview });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "PUT":
      try {
        const { id } = req.query;
        const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });

        if (updatedReview) {
          res.status(200).json({ success: true, data: updatedReview });
        } else {
          res.status(404).json({ success: false, error: "Review not found" });
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: "Method not allowed" });
      break;
  }
}

import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOption } from "@/pages/api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

export default async function handler(req, res) {
  await mongooseConnect();
  const sessionResult = await getServerSession(req, res, authOption);

  if (req.method === "POST") {
    if (sessionResult && sessionResult.user) {
      const { user } = sessionResult;
      const { product } = req.body;
      const wishedProductDoc = await WishedProduct.findOne({
        userEmail: user.email,
        product,
      });

      if (wishedProductDoc) {
        await WishedProduct.findByIdAndDelete(wishedProductDoc._id);
        res.json("remove from wishlist success");
      } else {
        await WishedProduct.create({ userEmail: user.email, product });
        res.json("Add to wishlist success");
      }
    } else {
      res.json({ message: "Authentication fail" });
    }
  }

  if (req.method === "GET") {
    if (sessionResult && sessionResult.user) {
      const { user } = sessionResult;
      res.json(
        await WishedProduct.find({ userEmail: user.email }).populate("product")
      );
    } else {
      res.json({ message: "Authentication fail" });
    }
  }
}

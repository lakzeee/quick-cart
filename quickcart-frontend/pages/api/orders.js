import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOption } from "@/pages/api/auth/[...nextauth]";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();
  const sessionResult = await getServerSession(req, res, authOption);

  if (req.method === "GET") {
    if (sessionResult && sessionResult.user) {
      const { user } = sessionResult;
      res.json(await Order.find({ userEmail: user.email }));
    } else {
      res.json({ message: "Authentication fail" });
    }
  }
}

import mongooseConnect from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOption } from "@/pages/api/auth/[...nextauth]";
import { Address } from "@/models/Address";

export default async function handler(req, res) {
  await mongooseConnect();
  const sessionResult = await getServerSession(req, res, authOption);

  if (sessionResult && sessionResult.user) {
    const { user } = sessionResult;
    const address = await Address.findOne({ userEmail: user.email });
    if (req.method === "PUT") {
      if (address) {
        res.json(await Address.findByIdAndUpdate(address._id, req.body));
      } else {
        res.json(await Address.create({ userEmail: user.email, ...req.body }));
      }
    } else {
      res.json(address);
    }
  }
}

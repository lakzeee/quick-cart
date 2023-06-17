import mongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  await mongooseConnect();
  if (req.method === "POST") {
    const { name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });
    res.json(categoryDoc);
  }
  if (req.method === "PUT") {
    const { _id, name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      { name, parent: parentCategory || undefined, properties }
    );
    res.json(categoryDoc);
  }
  if (req.method === "GET") {
    res.json(await Category.find().populate("parent"));
  }
  if (req.method === "DELETE") {
    if (req.query?.id) {
      await Category.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}

import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  await mongooseConnect();
  if (req.method === "GET") {
    if (req.query?.id) {
      const product = await Product.findOne({ _id: req.query.id });
      res.json(product);
    } else {
      const products = await Product.find();
      res.json(products);
    }
  }

  if (req.method === "POST") {
    const { name, description, price, images, category, properties } = req.body;
    const productDoc = await Product.create({
      name,
      description,
      price,
      images,
      category,
      properties,
    });
    res.json(productDoc);
  }

  if (req.method === "PUT") {
    const { _id, name, description, price, images, category, properties } =
      req.body;
    await Product.updateOne(
      { _id },
      { name, description, price, images, category, properties }
    );
    res.json(true);
  }

  if (req.method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}

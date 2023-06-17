import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  await mongooseConnect();
  const { categories, sort, phrase, ...filters } = req.query;
  const [sortField, sortOrder] = (sort || "_id,-1").split(",");
  const productQuery = {};
  if (categories) {
    productQuery.category = categories.split(",");
  }

  if (phrase) {
    productQuery["$or"] = [
      { title: { $regex: phrase } },
      { description: { $regex: phrase, $options: "i" } },
    ];
  }

  if (Object.keys(filters).length > 0) {
    Object.keys(filters).forEach((fn) => {
      productQuery["properties." + fn] = filters[fn];
    });
  }
  res.json(
    await Product.find(productQuery, null, {
      sort: { [sortField]: sortOrder },
    })
  );
}

import Header from "@/components/Header";
import Featured from "@/components/Featured";
import { Product } from "@/models/Product";
import mongooseConnect from "@/lib/mongoose";
import ProductsGridDisplay from "@/components/ProductsGridDisplay";
import { getServerSession } from "next-auth";
import { authOption } from "@/pages/api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";
import { Setting } from "@/models/Setting";

export default function HomePage({
  featureProduct,
  newProducts,
  wishedNewProducts,
}) {
  return (
    <div>
      <Header />
      <Featured product={featureProduct} />
      <ProductsGridDisplay
        products={newProducts}
        wishedProducts={wishedNewProducts}
        title="New Arrival"
      />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const featureProductSetting = await Setting.findOne({
    name: "featureProductId",
  });
  const featureProductId = featureProductSetting.value;
  const featureProduct = await Product.findById(featureProductId);
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  const sessionResult = await getServerSession(ctx.req, ctx.res, authOption);
  let wishedNewProducts = [];
  if (sessionResult && sessionResult.user) {
    const { user } = sessionResult;
    wishedNewProducts = await WishedProduct.find({
      userEmail: user.email,
      product: newProducts.map((p) => p._id.toString()),
    });
  }

  return {
    props: {
      featureProduct: JSON.parse(JSON.stringify(featureProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedNewProducts: wishedNewProducts.map((i) => i.product.toString()),
    },
  };
}

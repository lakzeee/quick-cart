import Center from "@/components/styled/Center";
import Header from "@/components/Header";
import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductsGridDisplay from "@/components/ProductsGridDisplay";
import styled from "styled-components";
import { getServerSession } from "next-auth";
import { authOption } from "@/pages/api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

const StyledDiv = styled.div`
  padding-top: 60px;
`;
export default function Products({ products, wishedProducts }) {
  return (
    <>
      <Header />
      <Center>
        <StyledDiv>
          <ProductsGridDisplay
            products={products}
            title="All Products"
            wishedProducts={wishedProducts}
          />
        </StyledDiv>
      </Center>
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  const sessionResult = await getServerSession(ctx.req, ctx.res, authOption);
  let wishedProducts = [];
  if (sessionResult && sessionResult.user) {
    const { user } = sessionResult;
    wishedProducts = await WishedProduct.find({
      userEmail: user.email,
      product: products.map((p) => p._id.toString()),
    });
  }
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      wishedProducts: wishedProducts.map((i) => i.product.toString()),
    },
  };
}

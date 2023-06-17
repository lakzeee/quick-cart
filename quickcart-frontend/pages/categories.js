import Header from "@/components/Header";
import Center from "@/components/styled/Center";
import Title from "@/components/styled/Title";
import PaddingDiv from "@/components/styled/PaddingDiv";
import mongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import ProductBox from "@/components/ProductBox";
import styled from "styled-components";
import { ArrowRightIcon } from "@/components/styled/Icons";
import Link from "next/link";
import { RevealWrapper } from "next-reveal";
import { getServerSession } from "next-auth";
import { authOption } from "@/pages/api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 512px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center; /* Align items vertically */

  > div {
    display: flex;
    align-items: center; /* Align items vertically */
    margin-left: auto; /* Push the "ShowAll" section to the right */
  }

  > div svg {
    width: 16px;
    height: auto;
    margin-left: 5px;
  }

  a {
    text-decoration: none;
    color: #555;
  }
`;

export default function categoriesPage({
  mainCategories,
  mainCategoriesProducts,
  wishedProducts = [],
}) {
  return (
    <>
      <Header />
      <Center>
        <PaddingDiv>
          {mainCategories?.map((cat) => (
            <div key={cat.name}>
              <TitleWrapper>
                <Title $categoryPadding>{cat.name}</Title>
                <div>
                  <Link href={"/category/" + cat._id}>Show All</Link>
                  <ArrowRightIcon />
                </div>
              </TitleWrapper>
              <CategoryGrid>
                {mainCategoriesProducts[cat._id].map((p, index) => (
                  <RevealWrapper key={p._id} origin="right" delay={index * 40}>
                    <ProductBox
                      {...p}
                      wished={wishedProducts.includes(p._id)}
                    />
                  </RevealWrapper>
                ))}
              </CategoryGrid>
            </div>
          ))}
        </PaddingDiv>
      </Center>
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const categories = await Category.find();
  const mainCategories = await categories.filter((c) => !c.parent);
  const mainCategoriesProducts = {};
  const allFetchedProductsId = [];
  for (const mc of mainCategories) {
    const mcId = mc._id.toString();
    const ccId = categories
      .filter((c) => c?.parent?.toString() === mcId)
      .map((c) => c._id.toString());
    const products = await Product.find({ category: [mcId, ...ccId] }, null, {
      limit: 3,
      sort: { _id: -1 },
    });
    mainCategoriesProducts[mc._id] = products;
    allFetchedProductsId.push(...products.map((p) => p._id.toString()));
  }

  const sessionResult = await getServerSession(ctx.req, ctx.res, authOption);
  let wishedProducts = [];
  if (sessionResult && sessionResult.user) {
    const { user } = sessionResult;
    wishedProducts = await WishedProduct.find({
      userEmail: user.email,
      product: allFetchedProductsId,
    });
  }

  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      mainCategoriesProducts: JSON.parse(
        JSON.stringify(mainCategoriesProducts)
      ),
      wishedProducts: wishedProducts.map((i) => i.product.toString()),
    },
  };
}

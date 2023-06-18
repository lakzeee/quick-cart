import Center from "@/components/styled/Center";
import Header from "@/components/Header";
import styled from "styled-components";
import Box from "@/components/styled/Box";
import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/styled/Button";
import { CartIcon } from "@/components/styled/Icons";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import toast from "react-hot-toast";
import axios from "axios";
import ReviewBox from "@/components/ReviewBox";
import Title from "@/components/styled/Title";
import { Review } from "@/models/Review";
import { RevealWrapper } from "next-reveal";

const ProductPageColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 40px;
  padding-top: 60px;
  @media screen and (min-width: 512px) {
    grid-template-columns: 1fr 1.2fr;
    gap: 40px;
  }
`;
const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  @media screen and (min-width: 512px) {
    padding-bottom: 0;
  }
`;
const Price = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const ProductDetailsBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CommentBox = styled.div`
  margin-top: 0;
  @media screen and (min-width: 512px) {
    margin-top: 48px;
  }
`;
const CommentColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  @media screen and (min-width: 512px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export default function ProductPage({ product, reviews }) {
  const { addCartProduct } = useContext(CartContext);
  const [comments, setComments] = useState([]);

  function handleButtonOnClick() {
    addCartProduct(product._id);
    toast.success(`${product.name} added to the cart`);
  }

  function maskEmail(email) {
    const atIndex = email.indexOf("@");

    if (atIndex === -1) {
      return email;
    }

    const username = email.slice(0, atIndex);

    const maskedUsername =
      username.charAt(0) + "***" + username.charAt(username.length - 1);

    return maskedUsername + "@" + "***.com";
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/review?productId=${product._id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <>
      <Header />
      <Center>
        <ProductPageColWrapper>
          <RevealWrapper delay={0}>
            <Box>
              <ProductImages images={product.images} />
            </Box>
          </RevealWrapper>
          <RevealWrapper origin={"right"} delay={10}>
            <ProductDetailsBox>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <PriceRow>
                <Price>${product.price}</Price>
                <Button $primary onClick={handleButtonOnClick}>
                  <CartIcon />
                  Add To Cart
                </Button>
              </PriceRow>
            </ProductDetailsBox>
          </RevealWrapper>
        </ProductPageColWrapper>
        <CommentBox>
          {reviews.length > 0 ? <h3>Reviews</h3> : <h3>No review yet</h3>}
          <CommentColumns>
            {reviews.length > 0 &&
              reviews.map((r, idx) => (
                <RevealWrapper
                  key={r._id}
                  delay={10 + idx * 40}
                  origin={"left"}
                >
                  <ReviewBox
                    userEmail={maskEmail(r.userEmail)}
                    title={r.title}
                    content={r.content}
                    rating={r.rating}
                    createdAt={r.createdAt}
                  />
                </RevealWrapper>
              ))}
          </CommentColumns>
        </CommentBox>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id);
  const reviews = await Review.find({ productId: id });
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      reviews: JSON.parse(JSON.stringify(reviews)),
    },
  };
}

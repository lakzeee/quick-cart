import styled from "styled-components";
import { CartIcon, HeartOutlineIcon } from "@/components/styled/Icons";
import Button from "@/components/styled/Button";
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";
import toast from "react-hot-toast";
import axios from "axios";

const ProductWrapper = styled.div``;

const MainBox = styled(Link)`
  background-color: white;
  padding: 20px;
  height: 120px;
  display: flex;
  text-align: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  img {
    max-width: 100%;
    max-height: 100px;
  }

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
  }
`;
const ProductInfoBox = styled.div`
  margin-top: 10px;
`;
const Title = styled(Link)`
  font-weight: normal;
  font-size: 0.9rem;
  margin: 0;
  color: inherit;
  text-decoration: None;
`;
const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;
const Price = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;
const ButtonsWrapper = styled.div``;

export default function ProductBox({
  _id,
  name,
  description,
  price,
  images,
  wished = false,
  onRemovedFromWishList = () => {},
}) {
  const [isWished, setIsWished] = useState(wished);
  const url = "/product/" + _id;
  const { addCartProduct } = useContext(CartContext);

  function handleProductBoxOnClick() {
    addCartProduct(_id);
    toast.success(`${name} added to the cart`);
  }

  function handleHeartOnClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    setIsWished(!isWished);
    axios.post("/api/wishlist", { product: _id }).then(() => {});
    if (!isWished) {
      toast.success(`${name} added to the wishlist`);
    } else {
      if (onRemovedFromWishList) {
        onRemovedFromWishList(_id);
      }
      toast.success(`${name} removed from the wishlist`);
    }
  }

  return (
    <ProductWrapper>
      <MainBox href={url}>
        <div>
          <img src={images[0]} alt={"/"} />
        </div>
      </MainBox>
      <ProductInfoBox>
        <Title href={url}>{name}</Title>
        <PriceRow>
          <Price>${price}</Price>
          <ButtonsWrapper>
            <Button $transparent filled={isWished} onClick={handleHeartOnClick}>
              <HeartOutlineIcon />
            </Button>
            <Button $white onClick={handleProductBoxOnClick}>
              <CartIcon />
            </Button>
          </ButtonsWrapper>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}

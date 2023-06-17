import Center from "@/components/styled/Center";
import styled from "styled-components";
import Button from "@/components/styled/Button";
import { CartIcon } from "@/components/styled/Icons";
import ButtonLink from "@/components/styled/ButtonLink";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";
import toast from "react-hot-toast";
import { RevealWrapper } from "next-reveal";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 100px 0;
`;
const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 2.5rem;
`;
const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  img {
    max-width: 80%;
    display: block;
    margin: 0 auto;
  }

  div:nth-child(1) {
    order: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @media screen and (min-width: 512px) {
    grid-template-columns: 1fr 1fr;
    img {
      max-width: 100%;
    }

    div:nth-child(1) {
      display: grid;
    }
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

export default function Featured({ product }) {
  const { addCartProduct } = useContext(CartContext);

  function handleAddToCartOnClick() {
    addCartProduct(product._id);
    toast.success(`${product.name} added to the cart`);
  }

  return (
    <div>
      <Bg>
        <Center>
          <ColumnsWrapper>
            <Column>
              <div>
                <RevealWrapper origin={"right"} delay={0}>
                  <Title>{product.name}</Title>
                  <Desc>{product.description}</Desc>
                  <ButtonsWrapper>
                    <ButtonLink
                      href={"/product/" + product._id}
                      $white
                      $outlined
                    >
                      Read More
                    </ButtonLink>
                    <Button $primary onClick={handleAddToCartOnClick}>
                      <CartIcon />
                      Add To Cart
                    </Button>
                  </ButtonsWrapper>
                </RevealWrapper>
              </div>
            </Column>
            <Column>
              <RevealWrapper delay={0}>
                <img src={product.images[0]} alt="" />
              </RevealWrapper>
            </Column>
          </ColumnsWrapper>
        </Center>
      </Bg>
    </div>
  );
}

import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/styled/Center";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import CartTable from "@/components/CartTable";
import CartInfoForm from "@/components/CartInfoForm";
import { RevealWrapper } from "next-reveal";
import Title from "@/components/styled/Title";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
  padding-top: 60px;
  @media screen and (min-width: 512px) {
    grid-template-columns: 1.3fr 0.7fr;
  }
`;
const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;
export default function CartPage() {
  const { cartProducts } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.post("/api/cart", { ids: cartProducts }).then((res) => {
      setProducts(res.data);
    });
  }, [cartProducts]);

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <RevealWrapper delay={0}>
            <Box>
              {!cartProducts?.length ? (
                <Title>Your cart is empty</Title>
              ) : (
                <Title>Cart</Title>
              )}
              {products?.length && (
                <CartTable products={products} cartProducts={cartProducts} />
              )}
            </Box>
          </RevealWrapper>
          {!!cartProducts?.length && (
            <RevealWrapper delay={100}>
              <Box>
                <CartInfoForm title="Order Information"></CartInfoForm>
              </Box>
            </RevealWrapper>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}

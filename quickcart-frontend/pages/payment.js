import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Center from "@/components/styled/Center";
import styled from "styled-components";
import { CartContext } from "@/components/CartContext";
import PaddingDiv from "@/components/styled/PaddingDiv";

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  margin-top: 30px;
`;
export default function Payment() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { clearCartProducts } = useContext(CartContext);
  const { success } = router.query;

  useEffect(() => {
    if (success) {
      clearCartProducts();
    }
  }, [success]);

  if (success) {
    return (
      <>
        <Header />
        <Center>
          <PaddingDiv>
            <Box>
              <h1>Thanks for your order!</h1>
              <p>Your Order will be deliver to you soon.</p>
            </Box>
          </PaddingDiv>
        </Center>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <Center>
          <PaddingDiv>
            <Box>
              <h1>Order Canceled</h1>
              <p>Please try again later</p>
            </Box>
          </PaddingDiv>
        </Center>
      </>
    );
  }
}

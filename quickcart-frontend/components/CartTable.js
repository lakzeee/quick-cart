import styled from "styled-components";
import Button from "@/components/styled/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";

const StyledTable = styled.table`
  width: 100%;

  th {
    text-align: left;
    text-transform: uppercase;
    color: #ccc;
    font-weight: 600;
    font-size: 0.7rem;
  }

  td {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

const StyleTd = styled.td`
  padding: 8px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;
const ProductImageBox = styled.div`
  width: 90px;
  height: 90px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;

  img {
    max-height: 80px;
    max-width: 80px;
  }

  @media screen and (min-width: 512px) {
    width: 100px;
    height: 100px;
  }
`;
const ProductQuantityBox = styled.span`
  margin: 1rem;
`;
export default function CartTable({ products, cartProducts }) {
  const [shippingFee, setShippingFee] = useState(0);
  const { addCartProduct, deductCartProduct } = useContext(CartContext);

  axios.get("/api/setting?name=shippingFee").then((res) => {
    setShippingFee(res.data.value);
  });

  function increaseProductQuantity(id) {
    addCartProduct(id);
  }

  function decreaseProductQuantity(id) {
    deductCartProduct(id);
  }

  let totalPrice = 0;
  for (const pid of cartProducts) {
    const price = products.find((p) => p._id === pid)?.price || 0;
    totalPrice += price;
  }

  return (
    <>
      <StyledTable>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const productQuantity = cartProducts.filter(
              (id) => id === p._id
            ).length;
            const subtotalPrice = p.price * productQuantity;
            return (
              <tr key={p._id}>
                <ProductInfoCell>
                  <ProductImageBox>
                    <img src={p.images[0]} alt="/" />
                  </ProductImageBox>
                  {p.name}
                </ProductInfoCell>
                <td>
                  <Button
                    $outlined
                    onClick={() => decreaseProductQuantity(p._id)}
                  >
                    -
                  </Button>
                  <ProductQuantityBox>{productQuantity}</ProductQuantityBox>
                  <Button
                    $outlined
                    onClick={() => increaseProductQuantity(p._id)}
                  >
                    +
                  </Button>
                </td>
                <td>${subtotalPrice}</td>
              </tr>
            );
          })}
          <tr>
            <StyleTd colSpan={2}>Products</StyleTd>
            <StyleTd>${totalPrice}</StyleTd>
          </tr>
          <tr>
            <StyleTd colSpan={2}>Shipping</StyleTd>
            <StyleTd>${shippingFee}</StyleTd>
          </tr>
          <tr>
            <StyleTd colSpan={2}>Total</StyleTd>
            <StyleTd>${totalPrice + parseInt(shippingFee)}</StyleTd>
          </tr>
        </tbody>
      </StyledTable>
    </>
  );
}

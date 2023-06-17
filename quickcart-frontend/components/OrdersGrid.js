import React, { useState } from "react";
import styled, { css } from "styled-components";
import { ArrowDown } from "@/components/styled/Icons";
import Button from "@/components/styled/Button";
import ReviewModal from "@/components/styled/ReviewModal";

const GridContainer = styled.div`
  padding: 20px;
  margin-bottom: 8px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DateTime = styled.div`
  font-size: 16px;
  color: #777;
  margin-bottom: 10px;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const Quantity = styled.span`
  color: #555;
  margin-right: 4px;
`;

const ProductName = styled.span`
  font-weight: bold;
  color: #333;
`;

const OrderInfo = styled.div`
  display: none;
  margin-top: 10px;
  font-size: 14px;
  color: #555;
  line-height: 1.5;

  span {
    font-weight: bold;
  }

  ${({ visible }) =>
    visible &&
    css`
      display: block;
      opacity: 0;
      animation: fadeIn 0.3s forwards;
    `} @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default function OrdersGrid({
  line_items,
  createdAt,
  userEmail,
  orderId,
  ...rest
}) {
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  const [isReviewModalShow, setIsReviewModalShow] = useState(false);
  const [reviewProduct, setReviewProduct] = useState("");
  const [reviewProductId, setReviewProductId] = useState("");

  const toggleOrderInfo = () => {
    setShowOrderInfo(!showOrderInfo);
  };

  function handleReviewOnClick(data) {
    setIsReviewModalShow(true);
    setReviewProduct(data.product_data.name);
    setReviewProductId(data.product_id);
  }

  return (
    <GridContainer>
      <DateTime onClick={toggleOrderInfo}>
        {new Date(createdAt).toLocaleString()}
      </DateTime>
      <div>
        {line_items.map((i) => (
          <ItemContainer key={i.price_data.product_data.name}>
            <ProductName>{i.price_data.product_data.name}</ProductName>
            <div>
              <Quantity> x {i.quantity}</Quantity>
              <Button onClick={() => handleReviewOnClick(i.price_data)}>
                Review
              </Button>
            </div>
          </ItemContainer>
        ))}
      </div>
      <OrderInfo visible={showOrderInfo}>
        {rest.name}
        <br />
        {rest.email}
        <br />
        {rest.streetAddress}
        <br />
        {rest.postalCode}
        <br />
        {rest.country}
        <br />
      </OrderInfo>
      <ReviewModal
        show={isReviewModalShow}
        onHide={() => setIsReviewModalShow(false)}
        userEmail={userEmail}
        orderId={orderId}
        product={reviewProduct}
        productId={reviewProductId}
      ></ReviewModal>
    </GridContainer>
  );
}

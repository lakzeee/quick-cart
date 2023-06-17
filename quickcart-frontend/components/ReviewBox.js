import React from "react";
import styled from "styled-components";

const ReviewContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
`;

const UserEmail = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const RatingContainer = styled.div`
  margin-bottom: 10px;
`;

const Star = styled.span`
  color: ${(props) => (props.filled ? "#ffc107" : "#e4e5e9")};
  font-size: 20px;
  margin-right: 5px;
`;

const ReviewTitle = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const ReviewContent = styled.div`
  color: #555555;
`;

const CreateTime = styled.div`
  color: #999999;
  margin-top: 4px;
  font-size: 12px;
`;

const ReviewBox = ({ userEmail, rating, title, content, createdAt }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} filled={i <= rating}>
          &#9733;
        </Star>
      );
    }
    return stars;
  };

  return (
    <ReviewContainer>
      <UserEmail>{userEmail}</UserEmail>
      <RatingContainer>{renderStars()}</RatingContainer>
      <ReviewTitle>{title}</ReviewTitle>
      <ReviewContent>{content}</ReviewContent>
      <CreateTime>{createdAt}</CreateTime>
    </ReviewContainer>
  );
};

export default ReviewBox;

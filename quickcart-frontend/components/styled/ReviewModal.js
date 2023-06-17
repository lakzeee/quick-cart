import { useEffect, useState } from "react";
import { Modal } from "react-overlays";
import styled from "styled-components";
import Button from "@/components/styled/Button";
import { Rating } from "react-simple-star-rating";
import toast from "react-hot-toast";
import axios from "axios";

const Backdrop = styled("div")`
  position: fixed;
  z-index: 80;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

const ReviewBox = styled.div`
  background-color: white;
  z-index: 120;
  position: fixed;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 440px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  h4 {
    margin: 16px 0;
  }
`;

const TitleInput = styled.input`
  width: 95%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ContentTextarea = styled.textarea`
  width: 95%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export default function ReviewModal({
  show,
  onHide = () => {},
  orderId,
  userEmail,
  product,
  productId,
}) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const handleSubmit = async () => {
    try {
      const reviewData = {
        userEmail,
        orderId,
        productId,
        rating,
        title,
        content,
      };

      if (editMode && existingReview) {
        const response = await axios.put(
          `/api/review?id=${existingReview._id}`,
          reviewData
        );
        toast.success("Update review success");
      } else {
        const response = await axios.post("/api/review", reviewData);
        toast.success("Add new review success");
      }
      onHide();
    } catch (error) {}
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `/api/review?userEmail=${userEmail}&productId=${productId}`
        );
        if (response.data.success) {
          const review = response.data.data;
          setExistingReview(review);
          setTitle(review.title);
          setContent(review.content);
          setRating(review.rating);
          setEditMode(true);
        } else {
          setExistingReview(null);
          setTitle("");
          setContent("");
          setRating(0);
          setEditMode(false);
        }
      } catch (error) {}
    };

    if (show && userEmail && productId) {
      fetchReview();
    }
  }, [show, userEmail, productId]);

  const renderBackdrop = (props) => <Backdrop {...props} />;

  return (
    <StyledModal show={show} onHide={onHide} renderBackdrop={renderBackdrop}>
      <ReviewBox>
        <h4>Write a Review for {product}</h4>
        <Rating
          initialValue={rating}
          onClick={(value) => {
            setRating(value);
          }}
        ></Rating>
        <TitleInput
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <ContentTextarea
          placeholder="Your review..."
          rows={4}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
        />
        <Button $primary onClick={handleSubmit}>
          {editMode ? "Finish Edit and Save" : "Submit Review"}
        </Button>
      </ReviewBox>
    </StyledModal>
  );
}

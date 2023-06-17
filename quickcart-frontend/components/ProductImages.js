import styled from "styled-components";
import { useState } from "react";

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
const MainImage = styled.img`
  max-width: 100%;
  max-height: 200px;
`;

const MainImageWrapper = styled.div`
  text-align: center;
`;
const ImagePreviews = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 0;
  margin-top: 10px;
`;
const ImagePreview = styled.div`
  border: 2px solid ${(props) => (props.active ? "#ccc" : "transparent")};
  opacity: ${(props) => (props.active ? "1" : "0.5")};
  transition: opacity 0.3s ease, border-color 0.3s ease;
  height: 60px;
  padding: 2px;
  cursor: pointer;
  border-radius: 5px;
`;
export default function ProductImages({ images }) {
  const [activeImg, setActiveImg] = useState(images?.[0]);
  return (
    <>
      <MainImageWrapper>
        <MainImage src={activeImg} alt="/" />
      </MainImageWrapper>
      <ImagePreviews>
        {images.map((image) => (
          <ImagePreview
            key={image}
            active={image === activeImg}
            onClick={() => setActiveImg(image)}
          >
            <Image src={image} alt="/" />
          </ImagePreview>
        ))}
      </ImagePreviews>
    </>
  );
}

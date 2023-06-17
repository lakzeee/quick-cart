import { BarLoader } from "react-spinners";
import styled from "styled-components";

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;
export default function Spinner({ width = 500 }) {
  return (
    <StyledDiv>
      <BarLoader color="#5542f6" width={width} />
    </StyledDiv>
  );
}

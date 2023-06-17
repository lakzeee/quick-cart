import styled, { css } from "styled-components";

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: Bold;
  margin: 10px 0;

  ${(props) =>
    props.$morePadding &&
    css`
      padding: 20px 0 5px 0;
    `}
`;

export default Title;

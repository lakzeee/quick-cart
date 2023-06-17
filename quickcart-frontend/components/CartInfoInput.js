import styled from "styled-components";

const StyledInput = styled.input`
  width: 90%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-bottom: 2px solid #ccc;
  background-color: transparent;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s;

  ::placeholder {
    color: #999;
  }

  :focus {
    border-color: #007bff;
    outline: none;
  }
`;

export default function CartInfoInput(props) {
  return <StyledInput {...props}></StyledInput>;
}

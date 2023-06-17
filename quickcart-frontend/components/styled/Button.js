import styled, { css } from "styled-components";
import { primary } from "@/lib/colors";

export const ButtonStyle = css`
  border: 0;
  padding: 5px 12px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  font-size: 0.9rem;
  background-color: rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  svg {
    height: 16px;
    margin-right: 5px;
  }

  ${(props) =>
    props.$outlined &&
    css`
      background-color: transparent;
      border: 1px solid rgba(0, 0, 0, 0.1);
    `}
  ${(props) =>
    props.$white &&
    !props.$outlined &&
    css`
      background-color: #fff;
      border: 1px solid #fff;
      color: #000;
    `}
  ${(props) =>
    props.$white &&
    props.$outlined &&
    css`
      background-color: transparent;
      border: 1px solid #fff;
      color: #fff;
    `}
  ${(props) =>
    props.$primary &&
    css`
      background-color: ${primary};
      border: 1px solid ${primary};
      color: #fff;
    `}
  ${(props) =>
    props.$large &&
    css`
      font-size: 1.2rem;
      padding: 10px 20px;
    `}
  ${(props) =>
    props.$block &&
    css`
      display: block;
      width: 100%;
    `}
  ${(props) =>
    props.$largeh &&
    css`
      padding: 10px;
    `}
  ${(props) =>
    props.$transparent &&
    css`
      background: transparent;
      padding: 5px;

      ${(props) =>
        props.filled &&
        `svg {
          fill: #5542f6;
          color: #5542f6
          }`}
      &:hover:not(:focus) {
        svg {
          fill: #5542f6;
          color: #5542f6;
          transform: scale(1.6);
          transition: fill 0.2s, transform 0.2s;
        }

        box-shadow: none;
        transform: none;
      }
    `}
  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
  }
`;

export const StyledButton = styled.button`
  ${ButtonStyle}
`;
export default function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}

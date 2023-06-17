import styled, { css } from "styled-components";

const Tabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;
const TabItem = styled.div`
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s ease-in-out, border-bottom 0.2s ease-in-out,
  font-weight 0.2s ease-in-out;

  ${(props) =>
    props.active
      ? css`
          color: black;
          border-bottom: 2px solid black;
          font-weight: bold;
        `
      : css`
          color: #999;
        `}
  &:hover {
    color: black;
    font-weight: bold;
  }
}
`;
export default function AccountTabs({ tabNames = [], active, onChange }) {
  return (
    <Tabs>
      {tabNames.map((name) => (
        <TabItem
          key={name}
          active={name === active}
          onClick={() => onChange(name)}
        >
          {name}
        </TabItem>
      ))}
    </Tabs>
  );
}

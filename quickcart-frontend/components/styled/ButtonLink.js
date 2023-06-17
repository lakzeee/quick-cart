import Link from "next/link";
import styled from "styled-components";
import { ButtonStyle } from "@/components/styled/Button";

const StyledLink = styled(Link)`
  ${ButtonStyle}
`;
export default function ButtonLink(pros) {
  return <StyledLink {...pros} />;
}

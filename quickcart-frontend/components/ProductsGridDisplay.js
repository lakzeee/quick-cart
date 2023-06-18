import styled from "styled-components";
import Center from "@/components/styled/Center";
import ProductBox from "@/components/ProductBox";
import { RevealWrapper } from "next-reveal";
import Title from "@/components/styled/Title";

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 512px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

export default function ProductsGridDisplay({
  products,
  title,
  wishedProducts = [],
}) {
  return (
    <Center>
      {title && <Title $morePadding>{title}</Title>}
      <ProductsGrid>
        {products?.length > 0 &&
          products.map((p, index) => (
            <RevealWrapper key={p._id} delay={index * 40}>
              <ProductBox {...p} wished={wishedProducts.includes(p._id)} />
            </RevealWrapper>
          ))}
      </ProductsGrid>
    </Center>
  );
}

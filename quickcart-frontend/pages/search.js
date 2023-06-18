import Header from "@/components/Header";
import Center from "@/components/styled/Center";
import styled from "styled-components";
import PaddingDiv from "@/components/styled/PaddingDiv";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import ProductsGridDisplay from "@/components/ProductsGridDisplay";
import { debounce } from "lodash";
import { BarLoader } from "react-spinners";

const SearchInput = styled.input`
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin: auto;
  font-size: 1.4rem;
  transition: box-shadow 0.3s ease;
  width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.24);

  &:focus {
    outline: none;
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.24);
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  position: sticky;
  z-index: 99;
  align-items: center;
  padding-bottom: 36px;
  top: 80px;
  margin-top: 40px;
`;

const LoaderWrapper = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99;
  opacity: ${(props) => (props.isLoading ? 1 : 0)};
  transition: opacity 1s ease-in-out;
`;
export default function SearchPage() {
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useCallback(debounce(fetchSearchResult, 500), []);

  function fetchSearchResult(phrase) {
    axios
      .get("/api/products?phrase=" + encodeURIComponent(phrase))
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [phrase]);
  return (
    <>
      {isLoading && (
        <LoaderWrapper isLoading={isLoading}>
          <BarLoader color="#5542f6" width="100%" />
        </LoaderWrapper>
      )}
      <Header />
      <Center>
        <PaddingDiv>
          <SearchInputWrapper>
            <SearchInput
              autoFocus
              value={phrase}
              onChange={(event) => setPhrase(event.target.value)}
              placeholder="Search here"
            />
          </SearchInputWrapper>
          {!isLoading && phrase !== "" && products.length === 0 && (
            <h2>{phrase} not found</h2>
          )}
          {!isLoading && (
            <ProductsGridDisplay products={products}></ProductsGridDisplay>
          )}
        </PaddingDiv>
      </Center>
    </>
  );
}

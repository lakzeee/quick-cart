import Header from "@/components/Header";
import Center from "@/components/styled/Center";
import { Category } from "@/models/Category";
import Title from "@/components/styled/Title";
import PaddingDiv from "@/components/styled/PaddingDiv";
import { Product } from "@/models/Product";
import ProductsGridDisplay from "@/components/ProductsGridDisplay";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import { sort } from "next/dist/build/webpack/loaders/css-loader/src/utils";
import Spinner from "@/components/styled/Spinner";

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const FilterWrapper = styled.div`
  display: flex;
  gap: 15px;
  @media (max-width: 768px) {
    // Adjust the breakpoint as needed
    padding-top: 10px;
    gap: 5px;
    flex-direction: column;
  }
`;

const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  gap: 5px;
  color: #444;

  select {
    background-color: inherit;
    border: 0;
    font-size: inherit;
  }
`;

export default function CategoryPage({
  category,
  childCategory,
  products: originalProducts,
}) {
  const [products, setProducts] = useState(originalProducts);
  const [priceSort, setPriceSort] = useState("price_1");
  const [isLoading, setIsLoading] = useState(false);
  const [filterValues, setFilterValues] = useState(
    category.properties.map((p) => ({ name: p.name, value: "all" }))
  );

  function fetchFilterResult() {
    const categoryIds = [
      category._id,
      ...(childCategory?.map((c) => c._id) || []),
    ];
    const params = new URLSearchParams();
    params.set("categories", categoryIds.join(","));
    params.set("sort", priceSort);
    filterValues.forEach((f) => {
      if (f.value !== "all") {
        params.set(f.name, f.value);
      }
    });
    const url = "/api/products?" + params.toString();
    axios.get(url).then((res) => {
      setProducts(res.data);
    });
  }

  useEffect(() => {
    setIsLoading(true);
    fetchFilterResult();
    setIsLoading(false);
  }, [filterValues, priceSort]);

  function handleFilterChange(filterName, filterValue) {
    setFilterValues((prevState) => {
      return prevState.map((p) => ({
        name: p.name,
        value: p.name === filterName ? filterValue : p.value,
      }));
    });
  }

  return (
    <>
      <Header />
      <Center>
        <PaddingDiv>
          <CategoryHeader>
            <Title>{category.name}</Title>
            <FilterWrapper>
              {category.properties.map((prop) => (
                <Filter key={prop.name}>
                  <span>{prop.name}</span>
                  <select
                    onChange={(event) =>
                      handleFilterChange(prop.name, event.target.value)
                    }
                    value={filterValues.find((f) => f.name === prop.name).value}
                  >
                    <option value="all">All</option>
                    {prop.values.map((val) => (
                      <option key={val}>{val}</option>
                    ))}
                  </select>
                </Filter>
              ))}
              <Filter>
                <span>Sort By: </span>
                <select
                  value={priceSort}
                  onChange={(event) => setPriceSort(event.target.value)}
                >
                  <option value="price,1">Price Lowest</option>
                  <option value="price,-1">Price Highest</option>
                  <option value="_id,1">Newest</option>
                  <option value="_id,-1">Oldest</option>
                </select>
              </Filter>
            </FilterWrapper>
          </CategoryHeader>
          {isLoading && <Spinner />}
          {!isLoading && (
            <div>
              {products.length <= 0 ? (
                <h2>Sorry, No Products Found</h2>
              ) : (
                <ProductsGridDisplay products={products}></ProductsGridDisplay>
              )}
            </div>
          )}
        </PaddingDiv>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  const category = await Category.findById(context.query.id);
  const childCategory = await Category.find({ parent: category._id });
  const categoryIds = [category._id, ...childCategory.map((c) => c._id)];
  const products = await Product.find({ category: categoryIds });
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      childCategory: JSON.parse(JSON.stringify(childCategory)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}

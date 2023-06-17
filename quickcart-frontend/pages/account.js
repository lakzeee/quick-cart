import Center from "@/components/styled/Center";
import Header from "@/components/Header";
import PaddingDiv from "@/components/styled/PaddingDiv";
import Title from "@/components/styled/Title";
import { useSession } from "next-auth/react";
import Button from "@/components/styled/Button";
import styled from "styled-components";
import Box from "@/components/styled/Box";
import { RevealWrapper } from "next-reveal";
import CartInfoInput from "@/components/CartInfoInput";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/styled/Spinner";
import ProductBox from "@/components/ProductBox";
import AccountTabs from "@/components/styled/AccountTabs";
import OrdersGrid from "@/components/OrdersGrid";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;

  @media screen and (min-width: 512px) {
    grid-template-columns: 1.3fr 0.7fr;
  }
`;

const InputsWrapper = styled.div`
  padding-bottom: 10px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;
export default function AccountPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isLoadingAccountInfo, setIsLoadingAccountInfo] = useState(false);
  const [wishedProducts, setWishedProduct] = useState([]);
  const [activeTab, setActiveTab] = useState("WishList");
  const [orders, setOrders] = useState([]);

  function handleSaveAccountInfo() {
    const data = { name, email, city, postalCode, streetAddress, country };
    axios.put("/api/address", data);
  }

  function handleRemoveFromWishList(id) {
    setWishedProduct((product) => {
      return [...product.filter((p) => p._id.toString() !== id)];
    });
  }

  useEffect(() => {
    axios.get("/api/address").then((res) => {
      const { name, email, city, postalCode, streetAddress, country } =
        res.data;
      setName(name);
      setEmail(email);
      setCity(city);
      setPostalCode(postalCode);
      setStreetAddress(streetAddress);
      setCountry(country);
      setIsLoadingAccountInfo(true);
    });
    axios.get("/api/wishlist").then((res) => {
      if (res.data.length > 0) {
        setWishedProduct(res.data.map((wp) => wp.product));
      }
    });
    axios.get("/api/orders").then((res) => {
      if (res.data.length > 0) {
        setOrders(res.data);
      }
    });
  }, []);

  return (
    <>
      <Header />
      <Center>
        <PaddingDiv>
          {session ? (
            <ColumnsWrapper>
              <RevealWrapper delay={0}>
                <Box>
                  <AccountTabs
                    tabNames={["WishList", "Orders"]}
                    active={activeTab}
                    onChange={setActiveTab}
                  />
                  {activeTab === "Orders" && (
                    <>
                      {orders.length > 0 &&
                        orders.map((order) => (
                          <OrdersGrid
                            key={order._id}
                            line_items={order.line_items}
                            createdAt={order.createdAt}
                            userEmail={order.userEmail}
                            orderId={order._id}
                            {...order}
                          />
                        ))}
                    </>
                  )}
                  {activeTab === "WishList" && (
                    <>
                      <WishedProductsGrid>
                        {wishedProducts.length > 0 &&
                          wishedProducts.map((wp) => (
                            <ProductBox
                              key={wp.name}
                              {...wp}
                              wished={true}
                              onRemovedFromWishList={handleRemoveFromWishList}
                            ></ProductBox>
                          ))}
                      </WishedProductsGrid>
                      {wishedProducts.length === 0 && (
                        <>
                          <p>Your Wishlist is Empty</p>
                        </>
                      )}
                    </>
                  )}
                </Box>
              </RevealWrapper>
              <RevealWrapper delay={100}>
                {!isLoadingAccountInfo ? (
                  <Spinner width={100} />
                ) : (
                  <Box>
                    <Title>Account Information</Title>
                    <InputsWrapper>
                      <CartInfoInput
                        type="text"
                        placeholder="Name"
                        value={name}
                        name="name"
                        onChange={(ev) => setName(ev.target.value)}
                      />
                      <CartInfoInput
                        type="text"
                        placeholder="Email"
                        value={email}
                        name="email"
                        onChange={(ev) => setEmail(ev.target.value)}
                      />
                      <CartInfoInput
                        type="text"
                        placeholder="City"
                        value={city}
                        name="city"
                        onChange={(ev) => setCity(ev.target.value)}
                      />
                      <CartInfoInput
                        type="text"
                        placeholder="Postal Code"
                        value={postalCode}
                        name="postalCode"
                        onChange={(ev) => setPostalCode(ev.target.value)}
                      />
                      <CartInfoInput
                        type="text"
                        placeholder="Street Address"
                        value={streetAddress}
                        name="streetAddress"
                        onChange={(ev) => setStreetAddress(ev.target.value)}
                      />
                      <CartInfoInput
                        type="text"
                        placeholder="Country"
                        value={country}
                        name="country"
                        onChange={(ev) => setCountry(ev.target.value)}
                      />
                    </InputsWrapper>
                    <Button
                      $primary
                      $block
                      $largeh
                      onClick={handleSaveAccountInfo}
                    >
                      Save
                    </Button>
                  </Box>
                )}
              </RevealWrapper>
            </ColumnsWrapper>
          ) : (
            <Title $morePadding>Please Log In to Review Account Info</Title>
          )}
        </PaddingDiv>
      </Center>
    </>
  );
}

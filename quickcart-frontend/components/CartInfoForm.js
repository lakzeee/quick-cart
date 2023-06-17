import CartInfoInput from "@/components/CartInfoInput";
import Button from "@/components/styled/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Title from "@/components/styled/Title";
import styled from "styled-components";

const InputsWrapper = styled.div`
  padding-bottom: 10px;
`;
export default function CartInfoForm({ title, disableButton = false }) {
  const { cartProducts } = useContext(CartContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isLoadingAccountInfo, setIsLoadingAccountInfo] = useState(false);

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
  }, []);

  async function handleCheckout() {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  return (
    <>
      <Title>{title}</Title>
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
      <Button $primary $block $largeh onClick={handleCheckout}>
        Continue to payment
      </Button>
    </>
  );
}

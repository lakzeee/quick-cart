import Link from "next/link";
import styled, { keyframes } from "styled-components";
import Center from "@/components/styled/Center";
import { useContext, useState } from "react";
import { CartContext } from "@/components/CartContext";
import { MenuIcon, SearchIcon, UserIcon } from "@/components/styled/Icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const fadeAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledHeader = styled.header`
  background: #222;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 10;
`;
const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  align-items: center;
  z-index: 3;
  display: flex;
`;

const LogoTitle = styled.div`
  font-size: ${(props) => (props.mobileNavOpen ? "2rem" : "1.2rem")};
  @media screen and (min-width: 512px) {
    font-size: 1.2rem;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${(props) => (props.mobileNavOpen ? "10px 0" : "20px 0")};
  @media screen and (min-width: 512px) {
    padding: 20px 0;
  }
`;

const StyledNav = styled.nav`
  display: ${(props) => (props.mobileNavOpen ? "block" : "none")};
  gap: 15px;
  position: fixed;
  top: 50px;
  bottom: 0;
  left: 0;
  right: 0;
  padding-top: 10px;
  padding-left: 40px;
  background-color: #222;
  font-size: 2rem;
  opacity: ${(props) => (props.mobileNavOpen ? 1 : 0)};
  animation: ${(props) => (props.mobileNavOpen ? fadeAnimation : "none")} 0.3s
    ease;
  transition: opacity 0.3s ease;
  @media screen and (min-width: 512px) {
    display: flex;
    position: static;
    padding: 0;
    font-size: 1rem;
    opacity: 1;
  }
`;

const NavLink = styled(Link)`
  display: block;
  color: #aaa;
  text-decoration: none;
  padding-bottom: 5px;

  svg {
    height: 20px;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  color: white;
  border: 0;
  width: 30px;
  height: 30px;
  cursor: pointer;
  @media screen and (min-width: 512px) {
    display: none;
  }
`;

const SearchLink = styled(Link)`
  display: block;
  color: #aaa;
  text-decoration: none;

  svg {
    height: 20px;
  }
`;

const AvatarWrapper = styled.div`
  display: block;
  color: #aaa;
  text-decoration: none;
  cursor: pointer;

  svg {
    height: 24px;
  }

  img {
    height: 24px;
    border-radius: 100%;
  }
`;
const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  @media screen and (max-width: 512px) {
    a {
      display: inline-block;
      min-width: 20px;
      color: white;
    }
  }
`;

const StyledMenItem = styled(MenuItem)`
  padding: 0 15px;
`;
export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const { data: session } = useSession();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  return (
    <StyledHeader>
      <Center>
        <Wrapper mobileNavOpen={isMobileNavOpen}>
          <Logo href={"/"}>
            <LogoTitle mobileNavOpen={isMobileNavOpen}>QuickCart</LogoTitle>
          </Logo>
          <StyledNav mobileNavOpen={isMobileNavOpen}>
            <NavLink href="/">Home</NavLink>
            <NavLink href={"/products"}>Products</NavLink>
            <NavLink href={"/categories"}>Categories</NavLink>
            <NavLink href={"/account"}>Account</NavLink>
            <NavLink href={"/cart"}>Cart({cartProducts.length})</NavLink>
          </StyledNav>
          <ButtonsWrapper>
            {session ? (
              <Menu
                menuButton={
                  <AvatarWrapper>
                    <img
                      className={"w-6 h-6 rounded-lg"}
                      src={session.user.image}
                    />
                  </AvatarWrapper>
                }
                transition
                align="end"
              >
                <StyledMenItem onClick={() => signOut()}>Log Out</StyledMenItem>
              </Menu>
            ) : (
              <Menu
                menuButton={
                  <AvatarWrapper>
                    <UserIcon />
                  </AvatarWrapper>
                }
                transition
                align="end"
              >
                <StyledMenItem onClick={() => signIn("google")}>
                  Log In
                </StyledMenItem>
              </Menu>
            )}
            <SearchLink href={"/search"}>
              <SearchIcon />
            </SearchLink>
            <NavButton onClick={() => setIsMobileNavOpen((pre) => !pre)}>
              <MenuIcon />
            </NavButton>
          </ButtonsWrapper>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}

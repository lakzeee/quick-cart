import { createGlobalStyle } from "styled-components";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { CartContextProvider } from "@/components/CartContext";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #eeee;
    padding: 0;
    margin: 0;
    font-family: 'Inter', sans-serif;
  }
`;
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400;600;700&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <GlobalStyles />
        <Toaster />
        <SessionProvider session={session}>
          <CartContextProvider>
            <Component {...pageProps} />
          </CartContextProvider>
        </SessionProvider>
      </HelmetProvider>
    </>
  );
}

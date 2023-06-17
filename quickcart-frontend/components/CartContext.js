import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  const ls = typeof window != "undefined" ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem("cart", JSON.stringify(cartProducts));
    } else {
    }
  }, [cartProducts]);

  useEffect(() => {
    const localItems = ls.getItem("cart");
    if (ls && localItems) {
      setCartProducts(JSON.parse(localItems));
    }
  }, []);

  function addCartProduct(productId) {
    setCartProducts((prev) => [...prev, productId]);
  }

  function deductCartProduct(productId) {
    setCartProducts((prev) => {
      const removeIdx = prev.indexOf(productId);
      if (removeIdx !== -1) {
        return prev.filter((value, index) => index !== removeIdx);
      }
      return prev;
    });
  }

  function clearCartProducts() {
    setCartProducts([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addCartProduct,
        deductCartProduct,
        clearCartProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

const addToCart = (product) => {
  setCart((prevCart) => {
    const existing = prevCart.find((item) => item._id === product._id);

    if (existing) {
      return prevCart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      return [...prevCart, { ...product, quantity: 1 }];
    }
  });
};
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

 const decreaseQty = (id) => {
  setCart((prevCart) => {
    const existing = prevCart.find(
      (item) => item._id === id
    );

    // 🔥 quantity 1 pe remove
    if (existing?.quantity === 1) {
      return prevCart.filter(
        (item) => item._id !== id
      );
    }

    // 🔥 quantity minus
    return prevCart.map((item) =>
      item._id === id
        ? {
            ...item,
            quantity: item.quantity - 1,
          }
        : item
    );
  });
};

const total = cart.reduce(
  (sum, item) =>
    sum +
    (item?.pricing?.sellingPrice || 0) *
      item.quantity,
  0
);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
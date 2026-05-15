import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const useCart = () =>
  useContext(CartContext);

export const CartProvider = ({
  children,
}) => {

  const [cart, setCart] = useState([]);

  // ✅ LOAD CART
  useEffect(() => {
    loadCart();
  }, []);

  // ✅ SAVE CART
  useEffect(() => {
    saveCart();
  }, [cart]);

  const loadCart = async () => {

    try {

      const savedCart =
        await AsyncStorage.getItem("cart");

      if (savedCart) {

        setCart(JSON.parse(savedCart));
      }

    } catch (error) {

      console.log(
        "LOAD CART ERROR:",
        error
      );
    }
  };

  const saveCart = async () => {

    try {

      await AsyncStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

    } catch (error) {

      console.log(
        "SAVE CART ERROR:",
        error
      );
    }
  };

  // ✅ ADD TO CART

  const addToCart = (product) => {

    setCart((prevCart) => {

      const existing = prevCart.find(
        (item) => item._id === product._id
      );

      // ALREADY EXISTS

      if (existing) {

        return prevCart.map((item) =>

          item._id === product._id

            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }

            : item
        );
      }

      // NEW PRODUCT

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // ✅ REMOVE

  const removeFromCart = (id) => {

    setCart((prevCart) =>
      prevCart.filter(
        (item) => item._id !== id
      )
    );
  };

  // ✅ INCREASE

  const increaseQty = (id) => {

    setCart((prevCart) =>

      prevCart.map((item) =>

        item._id === id

          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }

          : item
      )
    );
  };

  // ✅ DECREASE

  const decreaseQty = (id) => {

    setCart((prevCart) => {

      const existing = prevCart.find(
        (item) => item._id === id
      );

      // REMOVE IF 1

      if (existing?.quantity === 1) {

        return prevCart.filter(
          (item) => item._id !== id
        );
      }

      // MINUS QTY

      return prevCart.map((item) =>

        item._id === id

          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }

          : item
      );
    });
  };

  // ✅ CLEAR CART

  const clearCart = async () => {

    try {

      setCart([]);

      await AsyncStorage.removeItem(
        "cart"
      );

    } catch (error) {

      console.log(
        "CLEAR CART ERROR:",
        error
      );
    }
  };

  // ✅ TOTAL

  const total = cart.reduce(

    (sum, item) =>

      sum +

      (
        item?.pricing?.sellingPrice ||
        item?.price ||
        0
      ) * item.quantity,

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

        clearCart,

        total,
      }}
    >

      {children}

    </CartContext.Provider>
  );
};
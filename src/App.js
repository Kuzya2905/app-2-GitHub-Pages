import Header from "./components/Header/Header";
import axios from "axios";
import Cart from "./components/Cart/Cart";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import AppContext from "./context";
import Orders from "./pages/Orders";

function App() {
  const [items, setItems] = React.useState([]);
  const [visibleItems, setVisibleItems] = React.useState(items);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [orders, setOrders] = React.useState([]);
  const [stateOrder, setStateOrder] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);
  const [orderBtnLoading, setOrderBtnLoading] = React.useState(false);
  const [stateCart, setStateCart] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [totalSumCart, setTotalSumCart] = React.useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const itemsResponse = await axios.get(
          "https://654f47aa358230d8f0cd2b74.mockapi.io/Items"
        );
        const cartResponse = await axios.get(
          "https://654f47aa358230d8f0cd2b74.mockapi.io/cart"
        );
        const favoritesResponse = await axios.get(
          "https://655672a384b36e3a431fc526.mockapi.io/Favorite"
        );
        const orders = await axios.get(
          "https://655672a384b36e3a431fc526.mockapi.io/Orders"
        );

        setIsLoading(false);

        setItems(itemsResponse.data);
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setOrders(orders.data);
      } catch (error) {
        alert("Что-то пошло не так");
        console.error("Ошибка запроса данных");
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setVisibleItems(items);
  }, [items]);

  const sendOrder = async () => {
    try {
      setOrderBtnLoading(true);
      const { data } = await axios.post(
        "https://655672a384b36e3a431fc526.mockapi.io/Orders",
        cartItems
      );
      for (let i = 0; i < cartItems.length; i++) {
        await axios.delete(
          `https://654f47aa358230d8f0cd2b74.mockapi.io/cart/${cartItems[i].id}`
        );
      }
      setCartItems([]);
      setOrders((prev) => {
        if (prev.length === 0) {
          return [data];
        } else {
          return [...prev, data];
        }
      });
      setStateOrder(!stateOrder);
      setOrderBtnLoading(false);
    } catch (error) {
      alert("Что-то пошло не так");
      console.error("Ошибка запроса данных");
    }
  };

  const onAddToCart = async (obj) => {
    try {
      if (cartItems.find((item) => item.idMain === obj.idMain)) {
        const sereverIdItem = cartItems.find(
          (item) => obj.idMain === item.idMain
        ).id;

        await axios.delete(
          `https://654f47aa358230d8f0cd2b74.mockapi.io/cart/${String(
            sereverIdItem
          )}`
        );
        setCartItems((prev) =>
          prev.filter((item) => item.idMain !== obj.idMain)
        );
      } else {
        const { data } = await axios.post(
          "https://654f47aa358230d8f0cd2b74.mockapi.io/cart",
          obj
        );
        setCartItems((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Что-то пошло не так");
      console.error("Ошибка запроса данных");
    }
  };

  const onAddToFavorites = async (obj) => {
    if (favorites.find((item) => item.idMain === obj.idMain)) {
      const sereverIdItem = favorites.find(
        (item) => obj.idMain === item.idMain
      ).id;
      await axios.delete(
        `https://655672a384b36e3a431fc526.mockapi.io/Favorite/${String(
          sereverIdItem
        )}`
      );
      setFavorites((prev) => prev.filter((item) => item.idMain !== obj.idMain));
    } else {
      const { data } = await axios.post(
        "https://655672a384b36e3a431fc526.mockapi.io/Favorite",
        obj
      );
      setFavorites((prev) => [...prev, data]);
    }
  };

  const onDeleteItemCart = async (id) => {
    try {
      await axios.delete(
        `https://654f47aa358230d8f0cd2b74.mockapi.io/cart/${id}`
      );
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Что-то пошло не так");
      console.error("Ошибка запроса данных");
    }
  };

  const onDeleteFavorites = async (id) => {
    try {
      await axios.delete(
        `https://655672a384b36e3a431fc526.mockapi.io/Favorite/${id}`
      );
      setFavorites((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert("Что-то пошло не так");
      console.error("Ошибка запроса данных");
    }
  };

  const searchItems = (value) => {
    if (value) {
      return setVisibleItems(
        visibleItems.filter((item) => {
          return item.name.toUpperCase().includes(value.toUpperCase());
        })
      );
    } else {
      return setVisibleItems(items);
    }
  };

  const comeBack = () => {
    setStateCart(!stateCart);
    setStateOrder(false);
    const body = document.querySelector("body");
    body.className = "";
  };

  React.useEffect(() => {
    sumCart(cartItems);
  }, [cartItems]);

  const sumCart = (cartItems) => {
    let sum = cartItems.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
    sum = Math.round(sum + sum * 0.05);
    setTotalSumCart(sum);
  };

  const openCart = () => {
    setStateCart(!stateCart);
  };

  const counterFavorites = () => {
    return favorites.length;
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        cartItems,
        searchValue,
        visibleItems,
        totalSumCart,
        stateCart,
        isLoading,
        stateOrder,
        orders,
        orderBtnLoading,
        onDeleteFavorites,
        onAddToCart,
        onAddToFavorites,
        searchItems,
        setSearchValue,
        comeBack,
        onDeleteItemCart,
        openCart,
        sendOrder,
        counterFavorites,
      }}
    >
      <div className="wrapper">
        <Header />
        <Routes>
          <Route path="/app2-GitPage-/" element={<Home />} />
          <Route
            path="/app2-GitPage-/favorites"
            element={<Favorites />}
          ></Route>
          <Route path="/app2-GitPage-/orders" element={<Orders />}></Route>
        </Routes>
        {stateCart ? <Cart /> : null}
      </div>
    </AppContext.Provider>
  );
}

export default App;

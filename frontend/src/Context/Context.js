import React, { createContext, useReducer, useEffect, useState } from "react";
import axios from "axios";

import { shopReducer } from "./reducers";

import { FETCH_PRODUCT, REFRESH_CART, FETCH_ADRESS } from "./reducers";
export const MyContext = createContext();

export const Context = (props) => {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(shopReducer, {
    cart: [],
    token: localStorage.getItem("UserToken"),
    user: {
      name: localStorage.getItem("User"),
      id: localStorage.getItem("UserID"),
      adress: null,
    },
    products: [],
  });

  useEffect(() => {
    dispatch({
      type: REFRESH_CART,
      cart: JSON.parse(localStorage.getItem("cart")),
    });
  }, []);

  useEffect(() => {
    axios
      .get(` https://lit-thicket-99427.herokuapp.com/api/products/productuser`)
      .then((res) => {
        dispatch({ type: FETCH_PRODUCT, product: res.data });
        setLoading(true);
      })
      .catch((error) => {
        setLoading(false);
        // console.log(error.response.request.response);
        // setError(error.response.request.response);
      });
  }, []);

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      auth_token: `${localStorage.getItem("UserToken")}`,
    };
    axios
      .get(`https://lit-thicket-99427.herokuapp.com/api/user/useradress`, {
        headers: headers,
      })
      .then((res) => {
        if (res.status === 400) {
          console.log("err");
          setLoading(false);
        } else {
          dispatch({ type: FETCH_ADRESS, adress: res.data[0].adress });
          setLoading(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        // console.log(error.response.request.response);
        // setError(error.response.request.response);
      });
  }, []);
  return (
    <MyContext.Provider value={{ state, dispatch, loading }}>
      {props.children}
    </MyContext.Provider>
  );
};

export default Context;

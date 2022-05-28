import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../../Context/Context";
import { USER_LOGIN, USER_LOGOUT, ADD_PRODUCT } from "../../Context/reducers";
import axios from "axios";

export const UserLogin = () => {
  const { state, dispatch } = useContext(MyContext);

  const [user, setUser] = useState({ name: "", password: "" });

  const handleOnChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const LogIn = () => {
    axios
      .post(`https://lit-thicket-99427.herokuapp.com/api/user/login`, user)
      .then((res) => {
        window.localStorage.setItem("UserToken", res.data.token);
        window.localStorage.setItem("User", res.data.user);
        dispatch({
          type: USER_LOGIN,
          token: res.data.token,
          user: res.data.user,
        });
      });
  };

  //// Basket Test
  return (
    <div className="App">
      <h1>Login</h1>
      {localStorage.getItem("UserToken") ? (
        <button onClick={() => dispatch({ type: USER_LOGOUT })}>
          sign OUt
        </button>
      ) : (
        <div>
          <label>Name</label>
          <input type="text" name="name" onChange={handleOnChange} />
          <label>Password</label>
          <input type="text" name="password" onChange={handleOnChange} />
          <button onClick={LogIn}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default UserLogin;

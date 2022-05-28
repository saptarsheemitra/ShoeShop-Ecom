import React from "react";
import mainLogo from "./3191.jpg";
import "./sneaker.css";
import { Link } from "react-router-dom";
const Sneaker = () => {
  return (
    <div className="showBG">
      <div className="contText">
        <h1>THE SHOE SHOP</h1>
        <h2>Happy Shopping!</h2>
        <Link to={{ pathname: `/products`, state: "all" }}>
          <button className="showbtn">Browse</button>
        </Link>
      </div>

      <img src={mainLogo} alt="logo" className="imageLogo" />
    </div>
  );
};

export default Sneaker;

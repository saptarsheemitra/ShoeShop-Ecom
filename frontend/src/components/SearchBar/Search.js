import React from "react";
import { useLocation } from "react-router-dom";
import Product from "../Products/Product";
const Search = () => {
  const params = useLocation();

  if (params.state.arrayFiltered.length < 1) {
    return (
      <p>
        No items were found with keyword:{" "}
        <span style={{ color: "red" }}>{params.state.key}</span>
      </p>
    );
  }
  return (
    <div>
      <p>
        Search resutls with keyword:
        <span style={{ color: "red" }}> {params.state.key}</span>
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",

          flex: "1 1 0",
          justifyContent: "flex-start",
          width: "80%",
          margin: "0 auto",
        }}
      >
        {params.state.arrayFiltered.map((item, index) => {
          return <Product product={item} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Search;

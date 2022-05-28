import React, { useEffect, useState } from "react";
import Product from "../Products/Product";
import Paper from "@material-ui/core/Paper";

const TopRated = ({ state }) => {
  const [top, setTop] = useState([]);
  useEffect(() => {
    const calculate = (product) => {
      if (!product.reviews.length) {
        return 0;
      } else if (product.reviews.length === 1) {
        return product.reviews[0].rating;
      } else {
        const calculate = product.reviews.reduce((a, b) => {
          return (a.rating + b.rating) / product.reviews.length;
        });
        return calculate;
      }
    };
    const copy = [...state];
    const map = copy
      .sort((a, b) => {
        return calculate(a) - calculate(b);
      })
      .reverse();
    setTop(map);
  }, [state]);

  return (
    <div style={{ margin: "25px auto" }}>
      <Paper
        elevation={3}
        style={{
          width: "300px",
          height: "40px",
          textAlign: "center",
          alignItems: "center",
          padding: "5px 0",
          borderRadius: "20px",
          marginBottom: "-15px",
          fontSize: "20px",
          fontWeight: "700",
          fontFamily: "Goldman",
        }}
      >
        Highest Rated
      </Paper>
      <Paper
        elevation={3}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          margin: "0 auto",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {top.slice(0, 5).map((el, index) => {
          if (el.id) {
            return <Product key={index} product={el} />;
          } else {
            return <p key={index}>Loading...</p>;
          }
        })}
      </Paper>
    </div>
  );
};

export default TopRated;

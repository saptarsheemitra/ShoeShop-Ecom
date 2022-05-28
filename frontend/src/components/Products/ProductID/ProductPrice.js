import React, { useContext, useState, useEffect } from "react";

import { MyContext } from "../../../Context/Context";
import { Paper, makeStyles } from "@material-ui/core";
import AddCartButton from "./AddCartButton";
const windowCheck = window.screen.width;
const useStyles = makeStyles({
  paper: {
    height: "100px",
    marginTop: "15px",
    width: windowCheck < 420 ? "350px" : "",
    fontSize: "55px",
    display: "flex",
    fontFamily: "Goldman",
    textAlign: "center",
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",

    border: "1px solid grey",
  },
  paperBoxes: {
    marginTop: "25px",
    width: windowCheck < 420 ? "350px" : "",
    padding: "15px",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "flex-start",
  },
  boxes: {
    padding: "5px",
    fontSize: "18px",
    fontFamily: "Thasadith,sans-serif",
    margin: "5px",
    maxHeight: "50px",
    maxWidth: "50px",
    width: "45px",
    textAlign: "center",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#757575",
      color: "white",
    },
  },
  boxesRed: {
    padding: "5px",
    fontSize: "18px",
    fontFamily: "Thasadith,sans-serif",
    margin: "5px",
    maxHeight: "50px",
    maxWidth: "50px",
    width: "45px",
    textAlign: "center",
    backgroundColor: "#ffc107",
  },
  disabled: {
    padding: "5px",
    fontSize: "18px",
    fontFamily: "Thasadith,sans-serif",
    margin: "5px",
    maxHeight: "50px",
    maxWidth: "50px",
    width: "45px",
    textAlign: "center",
    backgroundColor: "#e0e0e0",
    color: "white",
  },
  mobileFlex: {
    display: "flex",
    flexDirection: "column",
  },
});
const ProductPrice = ({ product }) => {
  const { state } = useContext(MyContext);
  const [productID, setproductID] = useState({ ...product });
  const [disable, setDisable] = useState(false);

  const disableChange = (param) => {
    setDisable(param);
  };
  useEffect(() => {
    const copyState = [...state.cart];
    const findIndex = copyState.findIndex((item) => item.id === productID.id);
    if (findIndex < 0) {
      disableChange(false);
    } else {
      disableChange(true);
    }
  }, [state.cart, productID]);

  useEffect(() => {
    setproductID({ ...product });
  }, [product]);

  const handleChange = (e) => {
    const copy = { ...productID, selectedSize: e.target.innerText };
    setproductID(copy);
  };

  const classes = useStyles();
  return (
    <div>
      <AddCartButton product={product} selectedSize={productID.selectedSize} />
      <Paper className={classes.paper}>{product.price} €</Paper>
      <div style={{ marginTop: "25px" }}>
        <b>Select size:</b>
      </div>
      <Paper className={classes.paperBoxes}>
        {product.sizes.map((el, i) => {
          return !disable ? (
            <Paper
              key={i}
              className={
                el === productID.selectedSize ? classes.boxesRed : classes.boxes
              }
              variant="outlined"
              onClick={handleChange}
            >
              {Number(el)}
            </Paper>
          ) : (
            <Paper key={i} className={classes.disabled} variant="outlined">
              {el}
            </Paper>
          );
        })}
      </Paper>
    </div>
  );
};

export default ProductPrice;

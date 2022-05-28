import React, { useContext, useState, useEffect } from "react";
import { MyContext } from "../../../Context/Context";
import { makeStyles, Button, TextField, IconButton } from "@material-ui/core";
import { ADD_PRODUCT } from "../../../Context/reducers";
import ShopIcon from "@material-ui/icons/Shop";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import DialogWindow from "./DialogWindow ";
import AddFavorite from "./AddFavorite";
const windowCheck = window.screen.width;
const useStyles = makeStyles({
  addcart: {
    width: "350px",
    backgroundColor: "#ffc107",
    "&:hover": {
      backgroundColor: "#ffac33",
    },
  },
  mobileFlex: { display: "flex", flexDirection: "column" },
  greybtn: { backgroundColor: "#e0e0e0", width: "400px" },
  plusminus: { margin: "0 auto ", padding: "0px", color: "black" },
});

const AddCartButton = ({ product, selectedSize }) => {
  const classes = useStyles();
  const { state, dispatch } = useContext(MyContext);
  const [productID, setproductID] = useState({
    ...product,
    quantity: 1,
    selectedSize: selectedSize,
  });

  useEffect(() => {
    setproductID({
      ...product,
      quantity: 1,
      selectedSize: selectedSize,
    });
  }, [product]);

  const [disable, setDisable] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

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
      handleClose();
    }
  }, [state.cart, productID, product]);

  useEffect(() => {
    setproductID((p) => ({ ...p, selectedSize: selectedSize }));
  }, [selectedSize, product]);
  const handleChange = () => {
    const copy = { ...productID };
    copy.quantity++;

    setproductID(copy);
  };
  const handleChangeDecrement = () => {
    const copy = { ...productID };
    if (copy.quantity > 1) {
      copy.quantity--;
    }

    setproductID(copy);
  };
  const handleInput = (e) => {
    const copy = { ...productID, quantity: parseInt(e.target.value) };
    setproductID(copy);
  };

  const addToCart = () => {
    if (productID.selectedSize === "") {
      setOpen(true);
    } else {
      dispatch({ type: ADD_PRODUCT, product: productID });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: windowCheck < 1024 ? "350px" : "",
        margin: windowCheck < 1024 ? "5px" : "",
      }}
    >
      <TextField
        variant="outlined"
        label="Quantity"
        type="text"
        value={productID.quantity}
        onChange={handleInput}
        disabled={disable}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <IconButton
          className={classes.plusminus}
          onClick={handleChange}
          disabled={disable}
        >
          <AddBoxIcon />
        </IconButton>
        <IconButton
          className={classes.plusminus}
          onClick={handleChangeDecrement}
          disabled={disable}
        >
          <IndeterminateCheckBoxIcon />
        </IconButton>
      </div>

      {disable ? (
        <Button
          endIcon={<CheckCircleIcon />}
          className={classes.greybtn}
          disabled
        >
          In Cart
        </Button>
      ) : (
        <Button
          endIcon={<ShopIcon />}
          className={classes.addcart}
          onClick={addToCart}
        >
          Add to Cart
        </Button>
      )}
      <AddFavorite product={productID} state={state} />
      <DialogWindow open={open} handleClose={handleClose} product={product} />
    </div>
  );
};

export default AddCartButton;

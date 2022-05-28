import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DialogWindow from "./ProductID/DialogWindow ";

import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  makeStyles,
  Paper,
  IconButton,
} from "@material-ui/core";

import { MyContext } from "../../Context/Context";
import { ADD_PRODUCT } from "../../Context/reducers";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Rating } from "@material-ui/lab";

const windowCheck = window.screen.width;

const useStyles = makeStyles({
  root: {
    borderRadius: "5px",

    width: windowCheck < 1024 ? "45%" : "100%",

    maxWidth: windowCheck < 1024 ? "100%" : 250,
    maxHeight: windowCheck < 1024 ? 250 : 500,
    margin: "15px",
  },
  rootMobile: {
    borderRadius: "5px",

    width: "45%",
    maxHeight: 250,
    margin: "2px",
  },
  media: {
    height: windowCheck < 1024 ? 100 : 250,
    maxHeight: windowCheck < 1024 ? 200 : 300,

    position: "relative",
  },
  cardcontainer: {
    width: windowCheck < 1024 ? "100%" : "250px",
    height: windowCheck < 1024 ? "100%" : 500,
    maxWidth: windowCheck < 1024 ? "100%" : "250px",

    display: "flex",

    position: "relative",
  },
  btncontainer: {
    position: "absolute",
    bottom: windowCheck < 1024 ? 80 : 160,
    right: 0,
  },
  addToCart: {
    margin: "0 auto",
    width: "70px",
    height: "70px",
    border: "10px solid white",
    borderRadius: "50px",
    fontSize: "13px",
    padding: "5px 15px",
    backgroundColor: "#ffc107",
    transition: "1s",
    color: "black",
    "&:hover": {
      backgroundColor: "#ffac33",
      border: "5px solid grey",
      transform: "scale(1.2)",
    },
  },
  price: {
    marginTop: windowCheck < 1024 ? "5px" : "15px",
    fontFamily: "Goldman",
  },
  inCart: {
    margin: "0 auto",
    width: "70px",
    height: "70px",
    border: "10px solid white",
    borderRadius: "50px",
    fontSize: "13px",
    padding: "5px 15px",
    backgroundColor: "#e0e0e0",
    transition: "1s",
    color: "black",
  },
});

export default function Product({ product }) {
  const classes = useStyles();

  const { state, dispatch } = useContext(MyContext);
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
    const findIndex = copyState.findIndex((item) => item.id === product.id);
    if (findIndex < 0) {
      disableChange(false);
    } else {
      disableChange(true);
      handleClose();
    }
  }, [state.cart, product]);

  const addToCart = () => {
    if (product.selectedSize === "") {
      setOpen(true);
    } else {
      dispatch({ type: ADD_PRODUCT, product: product });
    }
  };
  const [hover, setHover] = useState(1);

  const imgCard = () => {
    if (hover === 2) {
      return (
        <CardMedia
          className={classes.media}
          image={`${product.image[1].location}`}
          title="Contemplative Reptile"
        />
      );
    } else {
      return (
        <CardMedia
          className={classes.media}
          image={`${product.image[0].location}`}
          title="Contemplative Reptile"
        />
      );
    }
  };

  useEffect(() => {
    if (!product.reviews.length) {
      setRating(0);
    } else if (product.reviews.length === 1) {
      setRating(product.reviews[0].rating);
    } else {
      const calculate = product.reviews.reduce((a, b) => {
        return (a.rating + b.rating) / product.reviews.length;
      });

      setRating(calculate);
    }
  }, [product]);

  const [rating, setRating] = useState(0);

  return (
    <Paper
      elevation={1}
      className={windowCheck < 420 ? classes.rootMobile : classes.root}
    >
      <Card
        className={classes.cardcontainer}
        onMouseOver={() => setHover(2)}
        onMouseOut={() => setHover(1)}
      >
        <CardActionArea>
          <Link
            to={`/products/${product.id}`}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <Rating
              style={{
                display: "flex",
                paddingBottom: "15px",
                justifyContent: "center",
              }}
              value={rating}
              name="simple-controlled"
              readOnly
              precision={0.5}
            />
            {imgCard()}

            <CardContent
              style={{
                maxHeight: windowCheck < 1024 ? "100%" : "200px",
                overflow: "hidden",
              }}
            >
              <Typography
                gutterBottom
                variant="h5"
                component={"h2"}
                style={{
                  fontFamily: "Exo 2",
                  height: windowCheck < 1024 ? "100%" : "50px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: windowCheck < 1024 ? "12px" : "",

                  marginTop: "25px",
                }}
              >
                {product.name},{product.color}
              </Typography>{" "}
              <Typography
                gutterBottom
                variant="h6"
                component="h2"
                className={classes.price}
              >
                {product.price}€
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>

        <CardActions className={classes.btncontainer}>
          {disable ? (
            <IconButton className={classes.inCart} disabled>
              <ShoppingCartIcon style={{ color: "grey" }} />
            </IconButton>
          ) : (
            <IconButton className={classes.addToCart} onClick={addToCart}>
              <AddShoppingCartIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
      <DialogWindow open={open} handleClose={handleClose} product={product} />
    </Paper>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  makeStyles,
  List,
  ListItem,
  Divider,
  ListItemText,
  Avatar,
  Paper,
  Box,
  Chip,
} from "@material-ui/core/";
import moment from "moment";
const windowCheck = window.screen.width;
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  mainPaper: {
    backgroundColor: "#eeeeee",
    display: "flex",
    width: "100%",
    flexDirection: "column",

    padding: "25px",
    margin: "15px",
  },
  inline: {
    display: "inline",
  },
  productList: {
    backgroundColor: "white",
    borderRadius: "5px",
    margin: "5px 0",
    "&:hover": {
      backgroundColor: "  #ffecb3",
    },
  },
}));

const MyOrders = ({ state }) => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const myOrders = () => {
      axios
        .get(`https://lit-thicket-99427.herokuapp.com/api/user/userorders`, {
          headers: {
            "Content-Type": "application/json",
            auth_token: state.token,
          },
        })

        .then((res) => {
          if (res.status === 400) {
            console.log("err");
          } else {
            setOrders(res.data[0].orders);
          }
        })
        .catch((error) => {
          // setError(error.response.request.response);
        });
    };
    myOrders();
  }, [state.token]);
  if (orders.length < 1) {
    return <p>No orders made yet....</p>;
  }
  return (
    <div style={{ width: "80%" }}>
      <List className={classes.root} style={{ justifyContent: "center" }}>
        {orders.map((el, index) => {
          return (
            <div key={index}>
              <Paper className={classes.mainPaper} elevation={3}>
                <Box
                  p={1}
                  bgcolor="primary.main"
                  color="primary.contrastText"
                  style={{ borderRadius: "5px" }}
                >
                  <p>
                    <b>Tracking Number:</b>
                    {` ${el.trackingNumber}`}
                  </p>
                </Box>
                <p>
                  <b>Date of Order:</b>
                  {moment(el.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                </p>
                <p>
                  <b>Current location:</b>
                  {` ${el.orderLocation}`}
                </p>

                <div>
                  <b>Order Status:</b>
                  <Chip
                    style={{
                      backgroundColor: "#ffe082",
                      margin: "0 5px",
                      fontWeight: "700",
                    }}
                    label={el.orderMessage}
                  />
                </div>

                <p>
                  <b>Amount:</b> {`${el.amount / 100} €`}
                </p>

                <p>
                  <b>Ordered products:</b>
                </p>
                {el.cart.map((key, ind) => {
                  return (
                    <Link
                      key={key.mongoProductID}
                      to={`/products/${key.mongoProductID}`}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                    >
                      <List key={ind} className={classes.productList}>
                        <ListItem>
                          {/* {el.cartMongo.map((key, ind) => {
                        return (
                          <Avatar
                            alt={key.name}
                            src={`http://localhost:4000/uploads/${key.image[0].location}`}
                          />
                        );
                      })} */}
                          <Avatar
                            style={{
                              border: "5px solid white",
                              margin: "5px",
                            }}
                            alt={key.name}
                            src={`${
                              el.cartMongo.find(
                                (z) => z.id === key.mongoProductID
                              ).image[0].location
                            }`}
                          />
                          <ListItemText
                            primary={`${key.name},${key.color} - size: ${key.selectedSize} , quantity: ${key.quantity}`}
                          />{" "}
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </List>
                    </Link>
                  );
                })}
              </Paper>
            </div>
          );
        })}
      </List>
    </div>
  );
};
// image={`http://localhost:4000/uploads/${product.image[0].location}`}
export default MyOrders;

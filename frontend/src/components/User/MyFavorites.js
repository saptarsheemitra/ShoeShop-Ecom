import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Product from "../Products/Product";
import { IconButton, makeStyles } from "@material-ui/core/";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  removeStyle: {
    marginBottom: "-25px",
    color: "white",
    position: "absolute",
    top: "0",
    zIndex: "55",
    border: "5px solid white",
    backgroundColor: "#ffc107",
    "&:hover": {
      backgroundColor: "#e65100",
    },
  },
}));

const MyFavorites = ({ state }) => {
  const classes = useStyles();
  const [myfavs, setmyFavs] = useState([]);

  const removeFromFav = useCallback((param) => {
    const headers = {
      "Content-Type": "application/json",
      auth_token: `${localStorage.getItem("UserToken")}`,
    };

    axios
      .put(
        ` https://lit-thicket-99427.herokuapp.com/api/user/deletefav`,
        { item: param },
        { headers: headers }
      )

      .then((res) => {
        if (res.status === 400) {
          console.log("err");
        } else {
          ReFetch();
        }
      })
      .catch((error) => {});
  }, []);

  const ReFetch = () => {
    axios
      .get(
        ` https://lit-thicket-99427.herokuapp.com/api/user/myfavs`,

        {
          headers: { auth_token: `${localStorage.getItem("UserToken")}` },
        }
      )

      .then((res) => {
        if (res.status === 401) {
          console.log("err");
        } else {
          setmyFavs(res.data.favorites);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    ReFetch();
  }, [state.user, removeFromFav]);

  if (myfavs.length < 1) {
    return <p>No products added yet in wishlist...</p>;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",

        justifyContent: "space-evenly",
        width: "100%",

        margin: "0 auto",
      }}
    >
      {myfavs.map((item, index) => {
        return (
          <div
            key={index}
            style={{
              position: "relative",
              width: "45%",
              margin: "5px",
              overflow: "hidden",
            }}
          >
            <IconButton
              onClick={() => removeFromFav(item.id)}
              className={classes.removeStyle}
            >
              <ClearIcon size="sm" />
            </IconButton>

            <div style={{ width: "300px" }}>
              <Product product={item} key={index} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyFavorites;

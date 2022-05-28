import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles, Button, Popover } from "@material-ui/core";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

const useStyles = makeStyles({
  favbtn: {
    color: "#ffc107",
    border: "1px solid #eeeeee",
    height: "100%",
    marginLeft: "5px",
    backgroundColor: "white",

    "&:hover": {
      backgroundColor: "#ffc107",
      color: "white",
    },
  },
});
const AddFavorite = ({ product, state }) => {
  const [disable, setDisable] = useState(false);
  const classes = useStyles();

  const addToFavorites = () => {
    axios
      .put(
        ` https://lit-thicket-99427.herokuapp.com/api/user/addfavorites`,

        { item: product.id },
        {
          headers: { auth_token: `${localStorage.getItem("UserToken")}` },
        }
      )

      .then((res) => {
        if (res.status === 400) {
          console.log("err");
          setDisable(false);
        } else {
          setDisable(true);
        }
      })
      .catch((error) => {
        setDisable(false);
        //   setError(error.response.request.response);
      });
  };

  useEffect(() => {
    axios
      .get(
        ` https://lit-thicket-99427.herokuapp.com/api/user/userfavs`,

        {
          headers: { auth_token: `${localStorage.getItem("UserToken")}` },
        }
      )

      .then((res) => {
        if (res.status === 401) {
          console.log("err");
        } else {
          const findFav = res.data.find((el) => el === product.id);
          if (findFav) {
            setDisable(true);
          } else {
            setDisable(false);
          }
        }
      })
      .catch((error) => {
        setDisable(true);
        console.log(error.response.request.response);
        //   setError(error.response.request.response);
      });
  }, [state.user, product.id]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div>
      <Button
        aria-describedby={id}
        className={classes.favbtn}
        // disabled={state.user.name === null}
        // onClick={addToFavorites}
        onClick={
          state.user.name === null || disable ? handleClick : addToFavorites
        }
      >
        {state.user.name === null || disable ? (
          <FavoriteIcon style={{ color: "#ff5722" }} />
        ) : (
          <FavoriteBorderIcon />
        )}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <p style={{ padding: "10px", color: "red" }}>
          {state.user.name === null
            ? "Please log in to use this function"
            : "  Already added in to your wishlist."}
        </p>
      </Popover>
    </div>
  );
};

export default AddFavorite;

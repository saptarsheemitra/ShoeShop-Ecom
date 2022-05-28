import React, { useState, useContext } from "react";
import axios from "axios";
import { MyContext } from "../../Context/Context";
import { FETCH_ADRESS, GUEST_ADRESS } from "../../Context/reducers";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from "@material-ui/core/";
const useStyles = makeStyles({
  loginbtn: {
    borderRadius: "25px",
    fontSize: "13px",
    padding: "5px 10px",
    marginRight: "5px",
    backgroundColor: "#ffc107",
    "&:hover": {
      backgroundColor: "#ffac33",
    },
  },
});
const UpdateAdress = ({ openUpdateAdress, handleCloseAdress }) => {
  const classes = useStyles();
  const { dispatch } = useContext(MyContext);
  const [adress, setAdress] = useState({
    adress: {
      street: "",
      phone: "",
      city: "",
      postcode: "",
      name: "",
      surname: "",
      contactemail: "",
    },
  });
  const [error, setError] = useState(null);
  const handleOnChange = (e) => {
    setAdress({
      ...adress,
      adress: { ...adress.adress, [e.target.name]: e.target.value },
    });
  };

  const headers = {
    "Content-Type": "application/json",
    auth_token: `${localStorage.getItem("UserToken")}`,
  };
  const addAdress = () => {
    axios
      .put(
        `https://lit-thicket-99427.herokuapp.com/api/user/update/${localStorage.getItem(
          "UserID"
        )}`,
        adress,
        { headers: headers }
      )

      .then((res) => {
        if (res.status === 400) {
          console.log("err");
        } else {
          console.log(res);
          dispatch({ type: FETCH_ADRESS, adress: res.data });
          handleCloseAdress();
        }
      })
      .catch((error) => {
        setError(error.response.request.response);
      });
  };
  const ConfirmAdress = () => {
    axios
      .post(`https://lit-thicket-99427.herokuapp.com/api/payment/checkadress`, {
        userinfo: { ...adress.adress },
      })

      .then((res) => {
        if (res.status === 400) {
          console.log("err");
        } else {
          setError(null);
          dispatch({ type: GUEST_ADRESS, ...adress });
          handleCloseAdress();
        }
      })
      .catch((error) => {
        setError(error.response.request.response);
      });
  };
  return (
    <Dialog
      open={openUpdateAdress}
      onClose={handleCloseAdress}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Update/Edit Adress</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill all fields (min 6 chars).
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          name="name"
          label="Name"
          type="name"
          fullWidth
          onChange={handleOnChange}
        />
        <TextField
          autoFocus
          margin="dense"
          id="surname"
          name="surname"
          label="Surname"
          type="surname"
          fullWidth
          onChange={handleOnChange}
        />
        <TextField
          autoFocus
          margin="dense"
          id="contactemail"
          name="contactemail"
          label="Email Contact"
          type="contactemail"
          fullWidth
          onChange={handleOnChange}
        />
        <TextField
          autoFocus
          margin="dense"
          id="street"
          name="street"
          label="Street"
          type="street"
          fullWidth
          onChange={handleOnChange}
        />

        <TextField
          autoFocus
          margin="dense"
          id="city"
          name="city"
          label="City"
          type="city"
          fullWidth
          onChange={handleOnChange}
        />
        <TextField
          autoFocus
          margin="dense"
          id="postcode"
          name="postcode"
          label="Post Code"
          type="postcode"
          fullWidth
          onChange={handleOnChange}
        />
        <TextField
          autoFocus
          margin="dense"
          id="phone"
          name="phone"
          label="Phone"
          type="phone"
          fullWidth
          onChange={handleOnChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseAdress} color="primary">
          Cancel
        </Button>
        <Button
          onClick={localStorage.getItem("UserID") ? addAdress : ConfirmAdress}
          className={classes.loginbtn}
        >
          Update Adress
        </Button>
      </DialogActions>
      {error && (
        <div>
          <p style={{ textAlign: "center", color: "red", fontWeight: "400" }}>
            {error}
          </p>
        </div>
      )}
    </Dialog>
  );
};

export default UpdateAdress;

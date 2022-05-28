import React, { useState, useContext } from "react";
import { MyContext } from "../../Context/Context";
import { USER_LOGIN } from "../../Context/reducers";
import axios from "axios";
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

const Register = ({ openRegister, handleCloseRegister }) => {
  const { dispatch } = useContext(MyContext);
  const classes = useStyles();
  const [user, setUser] = useState({
    name: "",
    password: "",
    email: "",
  });
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, setError] = useState(null);
  const handleOnChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const confirmPassword = (e) => {
    setPasswordTwo(e.target.value);
  };
  const addNewUser = (e) => {
    e.preventDefault();
    if (user.password !== passwordTwo) {
      setError("Passwords does not match!");
    } else {
      axios
        .post(`https://lit-thicket-99427.herokuapp.com/api/user/register`, user)

        .then((res) => {
          if (res.status === 400) {
            console.log("err");
          } else {
            window.localStorage.setItem("UserToken", res.data.token);
            window.localStorage.setItem("User", res.data.user);
            window.localStorage.setItem("UserID", res.data.userID);
            dispatch({
              type: USER_LOGIN,
              token: res.data.token,
              user: { name: res.data.user, id: res.data.userID },
            });
            setError(null);
            handleCloseRegister();
          }
        })
        .catch((error) => {
          setError(error.response.request.response);
        });
    }
  };
  return (
    <Dialog
      open={openRegister}
      onClose={handleCloseRegister}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={addNewUser}>
        <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
        <DialogContent>
          <DialogContentText>Please create a new account.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Username"
            type="name"
            fullWidth
            onChange={handleOnChange}
          />

          <TextField
            autoFocus
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            onChange={handleOnChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="passwordTwo"
            name="passwordTwo"
            label="Confirm password"
            type="password"
            fullWidth
            onChange={confirmPassword}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRegister} color="primary">
            Cancel
          </Button>
          <Button type="submit" className={classes.loginbtn}>
            Sign Up
          </Button>
        </DialogActions>
        {error && (
          <div>
            <p style={{ textAlign: "center", color: "red", fontWeight: "400" }}>
              {error}
            </p>
          </div>
        )}
      </form>
    </Dialog>
  );
};

export default Register;

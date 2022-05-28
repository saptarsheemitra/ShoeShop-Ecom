import React, { useState, useContext } from "react";
import { MyContext } from "../../Context/Context";
import { USER_LOGIN } from "../../Context/reducers";
import { Link, useHistory, useLocation } from "react-router-dom";
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
const windowCheck = window.screen.width;
const useStyles = makeStyles({
  loginbtn: {
    borderRadius: "25px",
    fontSize: windowCheck < 420 ? "10px" : "13px",
    padding: "5px 10px",
    marginRight: "5px",
    backgroundColor: "#ffc107",
    "&:hover": {
      backgroundColor: "#ffac33",
    },
  },
});

const Login = (props) => {
  const history = useHistory();
  const location = useLocation();

  const { dispatch } = useContext(MyContext);
  const classes = useStyles();
  const [user, setUser] = useState({ name: "", password: "" });
  const [error, setError] = useState(null);
  const handleOnChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const LogIn = async (e) => {
    e.preventDefault();
    await axios
      .post(` https://lit-thicket-99427.herokuapp.com/api/user/login`, user)

      .then((res) => {
        if (res.status === 400) {
          console.log("err");
        } else {
          localStorage.setItem("UserToken", res.data.token);
          localStorage.setItem("User", res.data.user);
          localStorage.setItem("UserID", res.data.userID);

          dispatch({
            type: USER_LOGIN,
            token: res.data.token,
            user: {
              name: res.data.user,
              id: res.data.userID,
              adress: res.data.adress,
            },
          });
          setError(null);
          props.handleClose();

          if (location.state && location.state.from) {
            history.replace(location.state.from.pathname);
          } else if (location.pathname === "/login") {
            history.replace("/");
          } else if (location.pathname) {
            history.replace(location.pathname);
          }
          // else go to home
          else {
            history.replace("/");
          }
        }
      })
      .catch((error) => {
        setError(error.response.request.response);
      });
  };

  return (
    <Dialog
      open={props.openLogin}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={LogIn}>
        <DialogTitle id="form-dialog-title">Log in</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please write your username and password to log in.
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
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            onChange={handleOnChange}
          />
        </DialogContent>
        <DialogActions>
          <Link
            to="/forgotpassword"
            onClick={props.handleClose}
            style={{
              textDecoration: "none",
              color: "black",
              margin: "5px",
              fontSize: windowCheck < 420 ? "11px" : "15px",
            }}
            className={classes.forgotpassword}
          >
            Forgot Password?
          </Link>
          <Button onClick={props.handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" className={classes.loginbtn}>
            Sign in
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

export default Login;

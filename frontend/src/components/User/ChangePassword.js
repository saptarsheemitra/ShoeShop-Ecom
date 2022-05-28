import React, { useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Button, TextField } from "@material-ui/core/";
const headers = {
  "Content-Type": "application/json",
};
const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [error, setError] = useState(null);
  const [succs, setSuccs] = useState(null);

  const location = useParams();
  const handleOnChange = (e) => {
    setPassword(e.target.value);
  };
  const confirmPassword = (e) => {
    setPasswordTwo(e.target.value);
  };

  const changePassword = (e) => {
    e.preventDefault();
    if (password !== passwordTwo) {
      setError("Passwords does not match!");
    } else {
      axios
        .put(
          ` https://lit-thicket-99427.herokuapp.com/api/user/resetpassword/`,
          { newPassword: password, resetLink: location.id },
          { headers: headers }
        )

        .then((res) => {
          if (res.status === 400) {
            console.log("err");
          } else {
            console.log(res);
            setSuccs(res.data);
            setPassword("");
            setPasswordTwo("");
            setError(null);
          }
        })
        .catch((error) => {
          setError(error.response.request.response);
        });
    }
  };
  return (
    <form
      onSubmit={changePassword}
      style={{ width: "300px", margin: "0 auto" }}
    >
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
      <Button type="submit" color="secondary" variant="outlined">
        Change password
      </Button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {succs && (
        <div style={{ color: "green" }}>
          {succs}
          <p>
            Please <Link to="/login">Log in </Link> with the new password
          </p>
        </div>
      )}
    </form>
  );
};

export default ChangePassword;

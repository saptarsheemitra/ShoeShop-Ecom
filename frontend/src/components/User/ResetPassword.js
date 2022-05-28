import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core/";

import axios from "axios";
const headers = {
  "Content-Type": "application/json",
};
const windowCheck = window.screen.width;
const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(null);
  const [succs, setSuccs] = useState(null);
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://lit-thicket-99427.herokuapp.com/api/user/forgotpassword/`,
        { email: email },
        { headers: headers }
      )

      .then((res) => {
        if (res.status === 400) {
          console.log("err");
        } else {
          setSuccs(res.data);
          setEmail("");
        }
      })
      .catch((error) => {
        setErr(error.response.request.response);
      });
  };
  return (
    <div style={{ width: "100%" }}>
      {" "}
      <form
        onSubmit={sendEmail}
        style={{
          margin: "25px auto",
          width: windowCheck <= "600px",
          border: "1px solid grey",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          padding: "15px",
        }}
      >
        <TextField
          value={email}
          onChange={handleChange}
          id="outlined-basic"
          label="email"
          variant="outlined"
          style={{ margin: "5px", padding: "5px", width: "300px" }}
        />
        <Button
          style={{ height: "50px", marginTop: "12px", padding: "10px" }}
          variant="contained"
          color="primary"
          type="submit"
        >
          Reset
        </Button>
      </form>
      {err && <div style={{ color: "red" }}>{err}</div>}
      {succs && <div style={{ color: "green" }}>{succs}</div>}
    </div>
  );
};

export default ResetPassword;

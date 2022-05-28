import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { MyContext } from "../../Context/Context";
import { REMOVE_ALL_CART } from "../../Context/reducers";
import { Paper, NoSsr, Box } from "@material-ui/core/";

const Success = () => {
  const { dispatch } = useContext(MyContext);
  const params = useLocation();

  useEffect(() => {
    dispatch({ type: REMOVE_ALL_CART });
  }, [dispatch]);
  if (!params.state) {
    return <p>No purchases!</p>;
  }
  return (
    <div>
      <NoSsr>
        <Box
          p={2}
          bgcolor="green"
          color="primary.contrastText"
          style={{ margin: "15px", borderRadius: "25px" }}
        >
          <div style={{ textAlign: "center" }}>Tracking ID:</div>
          <h1 style={{ textAlign: "center" }}>
            {params.state.detail.tracking_number}
          </h1>
        </Box>
      </NoSsr>

      <Paper elevation={3} style={{ padding: "15px", margin: "5px" }}>
        <h2>Shipping Adress</h2>
        <p>
          City:<b>{params.state.detail.address.city}</b>
        </p>
        <p>
          Adress:<b>{params.state.detail.address.line1}</b>
        </p>
        <p>
          PostCode:<b>{params.state.detail.address.postal_code}</b>
        </p>
      </Paper>
      <Paper elevation={3} style={{ padding: "15px", margin: "5px" }}>
        <h2>User info:</h2>
        <p>
          Name:<b>{params.state.detail.name}</b>
        </p>
        <p>
          phone:<b>{params.state.detail.phone}</b>
        </p>
        <p>
          Email:<b>{params.state.detail.receipt_email}</b>
        </p>
        <p>
          User:
          {params.state.detail.typeUser.name === null
            ? "Guest user"
            : params.state.detail.typeUser.name}
        </p>
      </Paper>
    </div>
  );
};

export default Success;

import React, { useState } from "react";
import UpdateAdress from "./UpdateAdress";
import { makeStyles, Button } from "@material-ui/core/";
import EditIcon from "@material-ui/icons/Edit";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  bar: {
    backgroundColor: "white",
    color: "grey",
    alignContent: "center",
  },
  indicator: {
    backgroundColor: "#ff9800",
  },
  editbtn: {
    borderRadius: "25px",
    fontSize: "13px",
    padding: "5px 10px",
    marginRight: "5px",
    backgroundColor: "#ffc107",
    "&:hover": {
      backgroundColor: "#ffac33",
    },
  },
}));

const Adress = ({ state }) => {
  const classes = useStyles();
  const [openUpdateAdress, setopenUpdateAdress] = useState(false);
  return (
    <div>
      <div
        style={{
          textAlign: "justify",
          margin: "0 auto",
          width: "300px",
        }}
      >
        <p>
          <b>Name: </b>
          {state.name}
        </p>
        <p>
          <b>Surname: </b>
          {state.surname}
        </p>
        <p>
          <b>Contact Email: </b>
          {state.contactemail}
        </p>
        <p>
          <b>city:</b> {state.city}
        </p>
        <p>
          <b>postcode:</b> {state.postcode}
        </p>
        <p>
          <b>phone: </b>
          {state.phone}
        </p>
        <p>
          <b>street: </b>
          {state.street}
        </p>

        <Button
          startIcon={<EditIcon />}
          className={classes.editbtn}
          onClick={() => setopenUpdateAdress(true)}
        >
          Edit/Update Adress
        </Button>
      </div>

      <UpdateAdress
        handleCloseAdress={() => setopenUpdateAdress(false)}
        openUpdateAdress={openUpdateAdress}
      />
    </div>
  );
};

export default Adress;

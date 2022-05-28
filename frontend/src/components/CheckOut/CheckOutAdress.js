import React, { useState } from "react";
import Adress from "../User/Adress";
import { Link } from "@material-ui/core/";
import Login from "../User/Login";
import GuestAdress from "./GuestAdress";
import UpdateAdress from "../User/UpdateAdress";

const CheckOutAdress = ({ state }) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openGuest, setOpenGuest] = useState(false);
  const [openUpdateAdress, setopenUpdateAdress] = useState(false);
  const handleClose = () => {
    setOpenLogin(false);
  };
  if (state.user.name === null) {
    return (
      <div style={{ margin: "0 auto" }}>
        {!state.user.guest && (
          <div>
            {" "}
            <Link onClick={() => setOpenLogin(true)}>Log in </Link>or continue
            as
            <Link onClick={() => setOpenGuest(true)}> Guest</Link>
          </div>
        )}

        <Login openLogin={openLogin} handleClose={handleClose} />
        <GuestAdress
          state={state}
          openUpdateAdress={openGuest}
          handleCloseAdress={() => setOpenGuest(false)}
        />
        {state.user.adress !== null && (
          <div>
            "Guest User" <Adress state={state.user.adress} />
          </div>
        )}
      </div>
    );
  } else
    return (
      <div>
        {!state.user.adress ? (
          <div>
            <button onClick={() => setopenUpdateAdress(true)}>
              Add ADress
            </button>
            <UpdateAdress
              handleCloseAdress={() => setopenUpdateAdress(false)}
              openUpdateAdress={openUpdateAdress}
            />
          </div>
        ) : (
          <Adress state={state.user.adress} />
        )}
      </div>
    );
};

export default CheckOutAdress;

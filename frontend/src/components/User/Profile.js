import React, { useState, useContext } from "react";
import { MyContext } from "../../Context/Context";
import MyOrders from "./MyOrders";
import MyFavorites from "./MyFavorites";

import Adress from "./Adress";
import UpdateAdress from "./UpdateAdress";
import PropTypes from "prop-types";
import { makeStyles, AppBar, Tabs, Tab, Box, Button } from "@material-ui/core/";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
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

const Profile = () => {
  const { state } = useContext(MyContext);

  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [openUpdateAdress, setopenUpdateAdress] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bar}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          style={{ margin: "0 auto" }}
          classes={{ indicator: classes.indicator }}
        >
          <Tab label="My Adress" {...a11yProps(0)} />
          <Tab label="My Wishlist" {...a11yProps(1)} />
          <Tab label="My Orders" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {!state.user.adress ? (
          <div>
            <Button
              color="primary"
              variant="contained"
              onClick={() => setopenUpdateAdress(true)}
            >
              Add ADress
            </Button>
            <UpdateAdress
              handleCloseAdress={() => setopenUpdateAdress(false)}
              openUpdateAdress={openUpdateAdress}
            />
          </div>
        ) : (
          <Adress state={state.user.adress} />
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MyFavorites state={state} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MyOrders state={state} />
      </TabPanel>
    </div>
  );
};

export default Profile;

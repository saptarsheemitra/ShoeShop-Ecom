import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context/Context";
import Login from "../components/User/Login";
import Register from "../components/User/Register";
import { Link, useHistory } from "react-router-dom";
import SelectSize from "../components/SelectSize/SelectSize";
import SearchBar from "../components/SearchBar/SearchBar";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";

////////////
import {
  USER_LOGOUT,
  REMOVE_PRODUCT,
  INCREMENT_QUANT,
  DECREMENT_QUANT,
  REMOVE_ALL_CART,
} from "../Context/reducers";
/////////////
import {
  fade,
  makeStyles,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Button,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
} from "@material-ui/core/";
/////////////
import MenuIcon from "@material-ui/icons/Menu";

import AccountCircle from "@material-ui/icons/AccountCircle";
import Paper from "@material-ui/core/Paper";

import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import ClearIcon from "@material-ui/icons/Clear";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
////////////////
const windowCheck = window.screen.width;
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    display: "none",
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
      fontFamily: "Goldman",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      justifyContent: "space-between",
      width: "250px",
    },
  },
  cartmobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  AppBar: {
    backgroundColor: "black",
  },
  spanUser: {
    fontSize: "15px",
    fontFamily: "Goldman",
    alignSelf: "center",
  },
  root: {
    width: windowCheck <= 1024 ? "100%" : "500px",

    flex: "1 1 0px",
  },
  list: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: "1 1 0px",
  },
  inline: {
    width: "100px",
  },
  plusminus: {
    marginLeft: "5px",
    width: "2px",
    height: "2px",
    color: "white",

    backgroundColor: "#ffc107",
    "&:hover": {
      backgroundColor: "#ffac33",
    },
    "& svg": {
      fontSize: "20px",
      color: "white",
    },
  },
  login: {
    cursor: "Pointer",
    "&:hover": {
      color: "#ffc107",
    },
  },

  navMenu: {
    fontFamily: "Goldman",
    color: "white",
    textDecoration: "none",
    "&:hover": {
      color: "#ffc107",
    },
  },
}));

export default function Layout(props) {
  const { state, dispatch } = useContext(MyContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElCart, setAnchorElCart] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isCartOpen = Boolean(anchorElCart);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [totalpricevalue, setTotalPrice] = useState(null);
  const [openNav, setOpenNav] = useState(true);

  //Open Login Dialog
  const [openLogin, setopenLogin] = useState(false);
  const [openRegister, setopenRegister] = useState(false);

  ///
  useEffect(() => {
    const totalPrice = () => {
      const copyArr = [...state.cart];
      const sum = copyArr.reduce((a, b) => a + b.price * b.quantity, 0);
      setTotalPrice(sum);
    };
    totalPrice();
  }, [state.cart]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const cartOpenHandler = (event) => {
    setAnchorElCart(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMenuCloseCART = () => {
    setAnchorElCart(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const history = useHistory();
  const signOut = () => {
    dispatch({ type: USER_LOGOUT });
    setAnchorEl(null);
    handleMobileMenuClose();
    history.push("/");
    history.replace("/");
  };

  const menuId = "primary-search-account-menu";
  const cartID = "primary-search-account-menu";

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link
        to="/userprofile"
        style={{ color: "black", textDecoration: "none" }}
      >
        <MenuItem onClick={handleMenuClose}>UserProfile</MenuItem>
      </Link>
      <Link
        to="/forgotpassword"
        style={{ color: "black", textDecoration: "none" }}
      >
        <MenuItem onClick={handleMenuClose}>Change Password</MenuItem>
      </Link>

      <MenuItem onClick={signOut}>Sign Out</MenuItem>
    </Menu>
  );
  const renderCart = (
    <Menu
      anchorEl={anchorElCart}
      style={{ marginTop: windowCheck <= 1024 ? "50px" : "0" }}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={cartID}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isCartOpen}
      onClose={handleMenuCloseCART}
    >
      <List className={classes.root}>
        {state.cart.map((item, index) => {
          return (
            <div className={classes.rootTwo} key={index}>
              <ListItem alignItems="flex-start" className={classes.list}>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={`${item.image[0].location}`} />
                </ListItemAvatar>

                <ListItemText
                  className={classes.inline}
                  primary={<b>{item.name}</b>}
                  secondary={item.price * item.quantity + "€"}
                />
                <SelectSize item={item} />
                <ListItemText
                  style={{
                    width: windowCheck <= 1024 ? "100px" : "",
                  }}
                  primary={<b>Quantity</b>}
                  secondary={
                    <>
                      {item.quantity}
                      <IconButton
                        className={classes.plusminus}
                        onClick={() =>
                          dispatch({ type: INCREMENT_QUANT, product: item })
                        }
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        className={classes.plusminus}
                        onClick={() =>
                          dispatch({ type: DECREMENT_QUANT, product: item })
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                    </>
                  }
                />

                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() =>
                      dispatch({ type: REMOVE_PRODUCT, product: item })
                    }
                  >
                    <ClearIcon
                      color="secondary"
                      style={{
                        fontSize: "30px",
                        display: "inline",
                        marginRight: windowCheck < 400 ? "-15px" : "",
                        width: windowCheck < 400 ? "30px" : "",
                      }}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </div>
          );
        })}
      </List>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          margin: "5px",
          padding: "10px",
        }}
      >
        <Button
          style={{
            fontSize: windowCheck <= 1024 ? "11px" : "",
            marginRight: windowCheck <= 1024 ? "5px" : "",
            height: windowCheck <= 1024 ? "35px" : "",
          }}
          startIcon={<ShoppingCartIcon />}
          variant="contained"
          color="primary"
          component={Link}
          to={"/checkout"}
          onClick={handleMenuCloseCART}
        >
          Check Out
        </Button>
        <Button
          style={{
            fontSize: windowCheck <= 1024 ? "11px" : "",
            height: windowCheck <= 1024 ? "35px" : "",
            marginRight: windowCheck <= 1024 ? "5px" : "",
          }}
          onClick={() => dispatch({ type: REMOVE_ALL_CART })}
          variant="outlined"
        >
          Clear All
        </Button>

        <Typography
          style={{
            fontSize: windowCheck <= 1024 ? "11px" : "",
          }}
          variant="button"
        >
          Total Price:<b>{totalpricevalue}</b>€
        </Typography>
      </div>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>

        <p onClick={() => setopenLogin(true)}>Login</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>

        <p onClick={() => setopenRegister(true)}>Sign Up</p>
      </MenuItem>
    </Menu>
  );

  const logedOnMobile = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <p style={{ textAlign: "center" }}>{state.user.name}</p>
      <Link
        to="/userprofile"
        style={{ color: "black", textDecoration: "none" }}
      >
        <MenuItem onClick={handleMenuClose}>UserProfile</MenuItem>
      </Link>
      <Link
        to="/forgotpassword"
        style={{ color: "black", textDecoration: "none" }}
      >
        <MenuItem onClick={handleMenuClose}>Change Password</MenuItem>
      </Link>

      <MenuItem onClick={signOut}>Sign Out</MenuItem>
    </Menu>
  );

  return (
    <div className="LayoutContainer">
      <div className={classes.grow}>
        <AppBar position="static" className={classes.AppBar}>
          <Toolbar
            style={{
              width: "80%",
              margin: "0 auto",
              position: "relative",
              paddingBottom: "15px",
              backgroundColor: "black",
            }}
          >
            <Paper
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                position: "absolute",
                width: "100%",
                height: openNav ? "40px" : "0px",
                // zIndex: "1",
                backgroundColor: "black",
                borderRadius: "15px",
                paddingBottom: "10px",

                top: 52,
                color: "white",

                transition: "0.5s",
                visibility: openNav ? "visible" : "hidden",
              }}
            >
              {openNav && (
                <div
                  style={{
                    width: "80%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Link
                    to={{ pathname: `/products`, state: "men" }}
                    className={classes.navMenu}
                  >
                    <p>Men</p>
                  </Link>
                  <Link
                    to={{ pathname: `/products`, state: "women" }}
                    className={classes.navMenu}
                  >
                    <p>Women</p>
                  </Link>
                  <Link
                    to={{ pathname: `/products`, state: "all" }}
                    className={classes.navMenu}
                  >
                    <p>All Shoes</p>
                  </Link>{" "}
                </div>
              )}
            </Paper>
            <IconButton
              onClick={() => setOpenNav(!openNav)}
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              {openNav ? <CancelPresentationIcon /> : <MenuIcon />}
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              <Link
                to={{ pathname: `/` }}
                style={{ color: "white", textDecoration: "none" }}
              >
                The Shoe Shop
              </Link>
            </Typography>

            <SearchBar state={state.products} />

            <div className={classes.grow} />
            <div className={classes.grow}>
              <Link
                to={{ pathname: `/trackpackage` }}
                className={classes.navMenu}
              >
                <p
                  style={{
                    display: "flex",
                    fontSize: windowCheck <= 1024 ? "12px" : "20px",
                    flexDirection: "row",
                  }}
                >
                  Order Tracking{" "}
                  <Badge>
                    <LocalShippingIcon />
                  </Badge>
                </p>
              </Link>{" "}
            </div>
            <div className={classes.cartmobile}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={cartID}
                aria-haspopup="true"
                onClick={cartOpenHandler}
                color="inherit"
              >
                <Badge badgeContent={state.cart.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </div>

            <div className={classes.sectionDesktop}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={cartID}
                aria-haspopup="true"
                onClick={cartOpenHandler}
                color="inherit"
              >
                <Badge badgeContent={state.cart.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              {localStorage.getItem("UserToken") ? (
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <span className={classes.spanUser}>
                    Welcome {state.user.name} <AccountCircle />
                  </span>
                </IconButton>
              ) : (
                <div className={classes.spanUser}>
                  <span
                    className={classes.login}
                    onClick={() => setopenLogin(true)}
                  >
                    Login{" "}
                  </span>
                  <span
                    className={classes.login}
                    onClick={() => setopenRegister(true)}
                  >
                    / Sign up
                  </span>
                </div>
              )}
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                {isMobileMenuOpen ? <CancelPresentationIcon /> : <MenuIcon />}
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        {localStorage.getItem("UserToken") ? logedOnMobile : renderMobileMenu}

        {renderMenu}
        {state.cart.length !== 0 && <Paper>{renderCart}</Paper>}
        <Login openLogin={openLogin} handleClose={() => setopenLogin(false)} />
        <Register
          openRegister={openRegister}
          handleCloseRegister={() => setopenRegister(false)}
        />
      </div>

      <div className="footermin">{props.children}</div>

      <footer>
        <AppBar position="static">
          <Toolbar style={{ backgroundColor: "black" }}></Toolbar>
        </AppBar>
      </footer>
    </div>
  );
}

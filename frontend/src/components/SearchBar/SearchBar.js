import React, { useState, useEffect, useRef } from "react";
import {
  makeStyles,
  InputBase,
  fade,
  List,
  ListItem,
  Avatar,
  Divider,
  ListItemAvatar,
  ListItemText,
  Paper,
  IconButton,
} from "@material-ui/core/";
import SearchIcon from "@material-ui/icons/Search";
import { Link, useHistory } from "react-router-dom";
const windowCheck = window.screen.width;
const useStyles = makeStyles((theme) => ({
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
    zIndex: "2",
  },
  searchIcon: {
    cursor: "pointer",
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
    height: "100%",
    [theme.breakpoints.up("md")]: {
      width: "23ch",
      height: "100%",
    },
  },
  searchBox: {
    width: windowCheck <= 768 ? "300px" : "100%",
    padding: "15px",
    margin: "0 auto",
    height: "500px",

    backgroundColor: "white",
    color: "black",
    position: "absolute",
    top: 40,
    left: -15,
    zIndex: "15",
    borderRadius: "5px",
  },
  theitem: {
    height: "100%",
    "&:hover": {
      backgroundColor: "#eeeeee",
    },
  },
  searchbtn: {
    backgroundColor: "#ffd180",
    color: "white",
    "&:hover": {
      backgroundColor: "#ffab40",
    },
  },
}));

const SearchBar = ({ state }) => {
  const history = useHistory();
  const wrapperRef = useRef(null);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [arrayFiltered, setarrayFiltered] = useState([]);
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (searchValue) {
      const filter = state.filter((el) => {
        let newobj = { name: el.name, color: el.color };
        let name = newobj.name + " " + newobj.color;

        return name.toLowerCase().includes(searchValue.toLocaleLowerCase());
      });
      setarrayFiltered(filter);
      if (filter.length >= 1) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  }, [searchValue, state]);

  const handleClose = () => {
    setOpen(false);
    setSearchValue("");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const sendToSearchRoute = (e) => {
    e.preventDefault();
    history.push({
      pathname: "/search",

      state: { arrayFiltered, key: searchValue },
    });
    handleClose();
  };

  const copyArr = [...arrayFiltered];
  return (
    <div className={classes.search}>
      <form onSubmit={sendToSearchRoute}>
        <div onClick={sendToSearchRoute} className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          value={searchValue}
          onChange={handleSearch}
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
        />

        {open && (
          <Paper className={classes.searchBox} ref={wrapperRef} elevation={3}>
            {arrayFiltered.length >= 1 && (
              <List>
                {" "}
                {copyArr.slice(0, 3).map((el, index) => {
                  return (
                    <Link
                      key={index}
                      onClick={handleClose}
                      to={`/products/${el.id}`}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        height: "100%",
                      }}
                    >
                      <ListItem key={index} className={classes.theitem}>
                        <ListItemAvatar>
                          <Avatar
                            style={{ border: "1px solid #9e9e9e" }}
                            alt={el.name}
                            src={`${el.image[1].location}`}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={el.name + "," + el.color} />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </Link>
                  );
                })}
              </List>
            )}
            <div style={{ float: "right", cursor: "pointer" }}>
              {`More results `}
              <IconButton
                onClick={sendToSearchRoute}
                className={classes.searchbtn}
              >
                <SearchIcon />
              </IconButton>
            </div>
          </Paper>
        )}
      </form>
    </div>
  );
};

export default SearchBar;

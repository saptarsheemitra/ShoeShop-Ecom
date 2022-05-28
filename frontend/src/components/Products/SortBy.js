import React, { useState } from "react";
import {
  makeStyles,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
  Paper,
} from "@material-ui/core/";
const windowCheck = window.screen.width;
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    textAlign: "center",

    padding: " 0 35px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    textAlign: "center",
  },
}));

const SortBy = (props) => {
  const classes = useStyles();

  return (
    <div
      style={{
        alignSelf: "flex-start",
        marginTop: "45px",
        display: "flex",
        justifyContent: "center",
        margin: windowCheck <= 768 ? "0 auto" : "",
      }}
    >
      <Paper elevation={3}>
        <FormControl className={classes.formControl}>
          <Select
            value={props.sort}
            onChange={props.handleChangeSort}
            displayEmpty
            className={classes.selectEmpty}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value="" disabled>
              Sort by
            </MenuItem>
            <MenuItem value={"Cheapest first"}>Cheapest first</MenuItem>
            <MenuItem value={"Expensive first"}>Expensive first</MenuItem>
            <MenuItem value={"Highest rating"}>Highest rating</MenuItem>
            <MenuItem value={"Lowest rating"}>Lowest rating</MenuItem>
          </Select>
          <FormHelperText>Sort by</FormHelperText>
        </FormControl>
      </Paper>
    </div>
  );
};

export default SortBy;

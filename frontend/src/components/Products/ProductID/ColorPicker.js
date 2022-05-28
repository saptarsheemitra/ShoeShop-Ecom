import React, { useState, useEffect } from "react";
import { Paper, makeStyles, Avatar } from "@material-ui/core/";
import { Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  paperBoxes: {
    marginTop: "25px",
    padding: "15px",
    height: "100px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "flex-start",
  },
  colors: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "1px solid black",
    cursor: "pointer",
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    border: "4px solid #bdbdbd",
    margin: "0 10px",
    transition: "1s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
}));

const ColorPicker = ({ productOriginal, state }) => {
  const classes = useStyles();
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const filterColors = state.filter((el) => el.name === productOriginal.name);

    setColors(filterColors);
  }, [productOriginal, state]);

  const Circle = (props) => {
    return (
      <Link to={`/products/${props.color}`}>
        <div>{props.children}</div>
      </Link>
    );
  };

  return (
    <Paper
      className={classes.paperBoxes}
      style={{ display: "flex", justifyContent: "flex-start" }}
    >
      {colors.map((el, i) => {
        return (
          <Circle color={el.id} key={i}>
            <Avatar
              src={`${el.image[0].location}`}
              alt={el.name}
              className={classes.large}
            />
          </Circle>
        );
      })}
    </Paper>
  );
};

export default ColorPicker;

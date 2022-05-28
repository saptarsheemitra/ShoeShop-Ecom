import React, { useState } from "react";
import {
  Paper,
  Tabs,
  Tab,
  makeStyles,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@material-ui/core/";
const windowCheck = window.screen.width;
const useStyles = makeStyles((theme) => ({
  indicator: {
    backgroundColor: "#ff9800",
    color: "black",
  },
  table: {
    maxWidth: windowCheck < 420 ? 200 : 600,
    minWidth: 100,
    margin: "0 auto",
  },
}));
const Description = ({ product }) => {
  const classes = useStyles();
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const Descp = () => {
    return (
      <div style={{ margin: "0 auto", textAlign: "center" }}>
        {" "}
        <p>{product.description}</p>
      </div>
    );
  };

  const Detail = () => {
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Brand:
              </TableCell>
              <TableCell align="right">{product.brand}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Color:
              </TableCell>
              <TableCell align="right">{product.color}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Category:
              </TableCell>
              <TableCell align="right">{product.category}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                In stock:
              </TableCell>
              <TableCell align="right">{product.countInStock}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Product ID:
              </TableCell>
              <TableCell align="right">{product.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Product Name:
              </TableCell>
              <TableCell align="right">{product.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Avaible Sizes:
              </TableCell>
              <TableCell align="right">
                {product.sizes.map((el) => el + ",")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const TabRender = () => {
    switch (value) {
      case 0:
        return <Descp />;
      case 1:
        return <Detail />;
      default:
        return <h1>err</h1>;
    }
  };

  return (
    <Paper
      style={{
        height: "300px",
        marginBottom: "500px",
        width: windowCheck <= 375 ? "350px" : "",
      }}
    >
      <Tabs
        value={value}
        classes={{ indicator: classes.indicator }}
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Description" />

        <Tab label="Details" />
      </Tabs>

      <TabRender />
    </Paper>
  );
};

export default Description;

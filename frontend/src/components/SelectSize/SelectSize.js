import React, { useContext, useState } from "react";
import { SELECT_SIZE } from "../../Context/reducers";
import { MyContext } from "../../Context/Context";
import { Select, MenuItem, InputLabel } from "@material-ui/core/";

const SelectSize = ({ item }) => {
  const { dispatch } = useContext(MyContext);

  const [productID, setproductID] = useState({ ...item });

  const handleChange = (e) => {
    const copy = { ...productID, selectedSize: Number(e.target.value) };
    setproductID(copy);
    dispatch({ type: SELECT_SIZE, product: copy });
  };

  return (
    <div
      style={{
        marginRight: "10px",

        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        width: "80px",
      }}
    >
      <InputLabel
        style={{ marginTop: "3px", color: "black", fontWeight: "600" }}
        id="demo-simple-select-helper-label"
      >
        Size
      </InputLabel>
      <Select
        style={{ maxHeight: "30px" }}
        variant="outlined"
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={productID.selectedSize}
        onChange={handleChange}
      >
        {item.sizes.map((item, i) => {
          return (
            <MenuItem key={i} value={item}>
              {item}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
};

export default SelectSize;

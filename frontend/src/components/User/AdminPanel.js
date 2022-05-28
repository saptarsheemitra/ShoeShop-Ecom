import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MyContext } from "../../Context/Context";
import { FETCH_PRODUCT } from "../../Context/reducers";

const headers = {
  auth_token: `${localStorage.getItem("UserToken")}`,
};
const AdminPanel = () => {
  const { dispatch } = useContext(MyContext);
  const [adminproduct, setAdminproduct] = useState({
    name: "",
    price: "",
    category: "",
    countInStock: "",
    brand: "",
    sizes: [40, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5, 46],
    description: "",
    selectedSize: "",
    color: "",
  });
  const [showit, setShowimage] = useState(null);
  const [image, setImage] = useState({ file: "" });
  const onChange = (e) => {
    setAdminproduct({ ...adminproduct, [e.target.name]: e.target.value });
  };

  const formData = new FormData();
  //   formData.append("productImage", image.file);
  formData.append("name", adminproduct.name);
  formData.append("price", adminproduct.price);
  formData.append("category", adminproduct.category);
  formData.append("countInStock", adminproduct.countInStock);
  formData.append("brand", adminproduct.brand);
  formData.append("description", adminproduct.description);
  formData.append("color", adminproduct.color);

  for (var i = 0; i < adminproduct.sizes.length; i++) {
    //Adds FormData Array (otherwise goes as string)
    formData.append("sizes[]", adminproduct.sizes[i]);
  }
  for (const key of Object.keys(image.file)) {
    formData.append("productImage", image.file[key]);
  }

  const onChangeImage = (e) => {
    setImage({ file: e.target.files });
  };

  const addNewProduct = () => {
    axios
      .post(
        `https://lit-thicket-99427.herokuapp.com/api/products/addproduct`,

        formData,
        {
          headers: headers,
        }
      )

      .then((res) => {
        if (res.status === 400) {
          console.log("err");
        } else {
          console.log(res);
        }
      })
      .catch((error) => {
        //   setError(error.response.request.response);
      });
  };

  useEffect(() => {
    axios
      .get(`https://lit-thicket-99427.herokuapp.com/api/products/productuser`)
      .then((res) => {
        dispatch({ type: FETCH_PRODUCT, product: res.data });
      });
  }, []);

  return (
    <div>
      name
      <input type="text" name="name" onChange={onChange} />
      price
      <input type="text" name="price" onChange={onChange} />
      category
      <input type="text" name="category" onChange={onChange} />
      countInstock
      <input type="number" name="countInStock" onChange={onChange} />
      brand
      <input type="text" name="brand" onChange={onChange} />
      description
      <textarea type="text" name="description" row="25" onChange={onChange} />
      color
      <input type="text" name="color" onChange={onChange} />
      <input
        type="file"
        name="productImage"
        onChange={onChangeImage}
        multiple
      />
      <button onClick={addNewProduct}>Add</button>
    </div>
  );
};

export default AdminPanel;

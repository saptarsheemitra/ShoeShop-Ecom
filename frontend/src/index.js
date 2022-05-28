import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Context from "./Context/Context";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <Router>
    <Context>
      <App />
    </Context>
  </Router>,

  document.getElementById("root")
);

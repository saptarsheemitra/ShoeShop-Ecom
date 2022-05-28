import React, { useContext, useState } from "react";
import { MyContext } from "./Context/Context";
import "./App.css";
import Sneaker from "./components/FrontPage/Sneaker";
import MostBought from "./components/FrontPage/MostBought";
import TopRated from "./components/FrontPage/TopRated";
import Products from "./components/Products/Products";
import Layout from "./Layout/Layout";
import Profile from "./components/User/Profile";
import { Switch, Route } from "react-router-dom";
import ProductID from "./components/Products/ProductID/ProductID";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import Login from "./components/User/Login";
import PrivateRoute from "./PrivateRoute";
import AdminPanel from "./components/User/AdminPanel";
import CheckOut from "./components/CheckOut/CheckOut";
import Success from "./components/CheckOut/Success";
import Tracker from "./components/Tracker/Tracker";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Search from "./components/SearchBar/Search";
import ResetPassword from "./components/User/ResetPassword";
import ChangePassword from "./components/User/ChangePassword";
import CircularProgress from "@material-ui/core/CircularProgress";
const stripePromise = loadStripe(
  "pk_test_51HugH2HIfBlErhlnFlqyz57Nft2p700zznt5h5Fj0Up8rEqQgyahdB2Dw8WNjJPpxKbNngpGAsHjBnv6gIOGjXAb0064AxWTjS"
);

function App() {
  const { state, loading } = useContext(MyContext);

  const [openLogin, setopenLogin] = useState(true);
  if (!loading) {
    return (
      <div
        style={{
          color: "orange",
          width: "100%",

          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          margin: "0 auto",
          flexDirection: "column",
        }}
      >
        <div style={{ color: "grey", margin: "0 auto" }}>
          <h1>Welcome to Shoe Sho,please wait while fetching....</h1>
        </div>
        <div style={{ color: "orange", width: "200px", margin: "0 auto" }}>
          <CircularProgress
            color="secondary"
            style={{ color: "orange", margin: "0 auto" }}
          />
        </div>
      </div>
    );
  }
  return (
    <Layout>
      <div className="App">
        <Breadcrumbs />

        <Switch>
          <Route exact path="/">
            <Sneaker />
            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "25px",
                width: "90%",
                margin: "0 auto",
              }}
            >
              <MostBought state={state.products} />
              <TopRated state={state.products} />
            </div>
          </Route>
          <Route exact path="/products">
            <Products />
          </Route>
          <Route path="/products/:id">
            <ProductID />
          </Route>

          <PrivateRoute exact path="/userprofile" component={Profile} />

          <Route path="/login">
            <h1> Please log in to use this section.</h1>
            <Login
              openLogin={openLogin}
              handleClose={() => setopenLogin(false)}
            />
          </Route>
          <Route path="/adminpanel">
            <AdminPanel />
          </Route>
          <Route path="/checkout">
            <Elements stripe={stripePromise}>
              <CheckOut />
            </Elements>
          </Route>
          <Route path="/finishedpaid">
            <Success />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/trackpackage">
            <Tracker />
          </Route>
          <Route path="/forgotpassword">
            <ResetPassword />
          </Route>
          <Route path="/changepassword/:id">
            <ChangePassword />
          </Route>
        </Switch>
      </div>
    </Layout>
  );
}

export default App;

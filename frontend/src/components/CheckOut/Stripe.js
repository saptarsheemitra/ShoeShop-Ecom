import React, { useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import "./Stripe.css";

const Stripe = ({ state, dispatch }) => {
  const history = useHistory();
  const sendToStrapiProducts = state.cart.map((el) => {
    const newArr = {
      price_data: {
        currency: "eur",
        product_data: {
          name: el.name,
          images: el.image.map((element) => {
            return `${element.location}`;
          }),
        },
        unit_amount: el.price * 100,
      },
      quantity: el.quantity,
    };

    return newArr;
  });

  ///////////////////

  const stripe = useStripe();
  const elements = useElements();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [mongoWaiter, setmongoWaiter] = useState(null);

  useEffect(() => {
    window
      .fetch(
        "https://lit-thicket-99427.herokuapp.com/api/payment/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: sendToStrapiProducts,
            userinfo: state.user.adress,
            cart: state.cart,
            typeUser: state.user,
          }),
        }
      )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // const waiter = { ...data.cartItems };
        const waiter = {
          ...JSON.parse(data.metadata.cartProducts),
          ...JSON.parse(data.metadata.typeUser),
        };
        setmongoWaiter({ ...waiter }); //////////
        setClientSecret(data.clientSecret);
      });
  }, [state.cart, state.user.adress, state.user]);

  const orderstoMongo = (param) => {
    let array = [];
    param.cartItems.map((el) => {
      return array.push(el.mongoProductID);
    });
    // const user = param.typeUser.id;

    const orders = {
      cart: param.cartItems,
      cartMongo: array,
      adress: {
        city: param.address.city,
        street: param.address.line1,
        postcode: param.address.postal_code,
      },
      date: param.dateofsucc,
      clientname: param.name,
      email: param.receipt_email,
      phone: param.phone,
      orderMessage: param.orderStatus.message,
      orderLocation: param.orderStatus.location,
      trackingNumber: param.tracking_number,
      amount: param.amount,
      // metadata: param.metadata.cartProducts,
    };

    const headers = {
      "Content-Type": "application/json",
      auth_token: `${localStorage.getItem("UserToken")}`,
    };
    fetch("https://lit-thicket-99427.herokuapp.com/api/payment/orderstomongo", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ orders }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        history.push({
          pathname: "/finishedpaid",

          state: { detail: param },
        });
      });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      const objtoMongoOders = {
        ...mongoWaiter,
        ...payload.paymentIntent.shipping,
        dateofsucc: payload.paymentIntent.created,
        receipt_email: payload.paymentIntent.receipt_email,
        amount: payload.paymentIntent.amount,
        orderStatus: { message: "Processing", location: "Hakunila R-Kiosk" },
      }; ///////////This goes to mongo If succes

      setError(null);
      setProcessing(false);
      setSucceeded(true);
      orderstoMongo(objtoMongoOders);

      // history.push({
      //   pathname: "/finishedpaid",

      //   state: { detail: objtoMongoOders },
      // });
    }
  };
  const handleChange = async (event) => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",

        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div>
      <h1>Payment</h1>

      <form id="payment-form" onSubmit={handleSubmit} className="Stripeform">
        <CardElement
          className="Stripeinput "
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
          name
        />
        <button
          disabled={processing || disabled || succeeded}
          id="submit"
          className={succeeded ? "StripebuttonGreen" : "Stripebutton"}
        >
          <span id="button-text">
            {processing ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              `${succeeded ? "Paid" : "Pay"}`
            )}
          </span>
        </button>

        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}

        {succeeded && <p>Succsesfully paid !</p>}
      </form>
      <div style={{ margin: "5px", textAlign: "center" }}>
        This is Stripe Payment service
      </div>
    </div>
  );
};

export default Stripe;

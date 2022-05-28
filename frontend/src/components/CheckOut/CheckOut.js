import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "../../Context/Context";
import { FETCH_ADRESS } from "../../Context/reducers";
import axios from "axios";
import {
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@material-ui/core/";
import CheckOutCart from "./CheckOutCart";
import CheckOutAdress from "./CheckOutAdress";
import Stripe from "./Stripe";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Your Cart", "Adress/Billing information", "Payment"];
}

const CheckOut = () => {
  const { state, dispatch } = useContext(MyContext);

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      auth_token: `${localStorage.getItem("UserToken")}`,
    };
    if (state.user.name !== null) {
      axios
        .get(` https://lit-thicket-99427.herokuapp.com/api/user/useradress`, {
          headers: headers,
        })
        .then((res) => {
          if (res.status === 400) {
            console.log("err");
          } else {
            dispatch({ type: FETCH_ADRESS, adress: res.data[0].adress });
          }
        })
        .catch((error) => {
          // console.log(error.response.request.response);
          // setError(error.response.request.response);
        });
    }
  }, [dispatch, state.user.name]);
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const steps = getSteps();
  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return state.cart.length !== 0 ? (
          <CheckOutCart state={state} dispatch={dispatch} />
        ) : (
          "Your Cart is empty , please add atleast one item!"
        );
      case 1:
        return <CheckOutAdress state={state} />;
      case 2:
        return <Stripe state={state} dispatch={dispatch} />;
      default:
        return "Unknown stepIndex";
    }
  }
  const handleNext = () => {
    if (state.cart.length !== 0)
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div style={{ marginTop: "25px" }}>
            {getStepContent(activeStep)}

            <div style={{ marginTop: "25px" }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              {activeStep === 1 && (
                <Button
                  disabled={
                    state.user.adress === null ||
                    state.user.adress === undefined
                  }
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              )}
              {activeStep === 0 && (
                <Button
                  disabled={state.cart.length === 0}
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CheckOut;

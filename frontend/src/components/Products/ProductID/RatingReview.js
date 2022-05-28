import React, { useState, useEffect } from "react";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Chip,
  Popover,
} from "@material-ui/core";
import RateReviewIcon from "@material-ui/icons/RateReview";
import RatingAll from "./RatingAll";

const RatingReview = ({ productId, product, user }) => {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState({
    review: "",
    rating: 0,
    products: productId,
  });
  const [error, setError] = useState(null);
  const [headers, setHeaders] = useState({
    auth_token: `${localStorage.getItem("UserToken")}`,
  });

  const handleText = (e) => {
    setReview({ ...review, review: e.target.value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    setHeaders({ auth_token: `${localStorage.getItem("UserToken")}` });
  }, [user]);
  const addReview = () => {
    axios
      .post(
        ` https://lit-thicket-99427.herokuapp.com/api/products/addreview`,

        review,
        {
          headers: headers,
        }
      )

      .then((res) => {
        if (res.status === 400) {
          console.log("err");
        } else {
          handleClose();
          window.location.reload();
        }
      })
      .catch((error) => {
        setError(error.response.request.response);
      });
  };
  useEffect(() => {
    if (!product.reviews.length) {
      setRating(0);
    } else if (product.reviews.length === 1) {
      setRating(product.reviews[0].rating);
    } else {
      const calculate = product.reviews.reduce((a, b) => {
        return (a.rating + b.rating) / product.reviews.length;
      });

      setRating(calculate);
    }
  }, [product]);

  const [rating, setRating] = useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const openPop = Boolean(anchorEl);
  const id = openPop ? "simple-popover" : undefined;
  if (user.name === null) {
    return (
      <div>
        <div
          style={{
            alignContent: "center",

            display: "flex",
          }}
        >
          {" "}
          <Rating
            value={rating}
            name="simple-controlled"
            readOnly
            precision={0.5}
          />
          <span>({rating})</span>
          <Chip
            variant="outlined"
            color="primary"
            size="small"
            label={`Total ${product.reviews.length} reviews / New review`}
            onClick={handleClickOpen}
            icon={<RateReviewIcon />}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Reviews</DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              margin: "0 auto",
            }}
          >
            <DialogContentText>
              All reviews for this product .
            </DialogContentText>
            <RatingAll reviews={product} />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
            <Button aria-describedby={id} color="primary" onClick={handleClick}>
              Review it!
            </Button>
            <Popover
              id={id}
              open={openPop}
              anchorEl={anchorEl}
              onClose={handleClosePopOver}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <p style={{ padding: "10px", color: "red" }}>
                Please log in to Review it!
              </p>
            </Popover>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  return (
    <div>
      <div
        style={{
          alignContent: "center",

          display: "flex",
        }}
      >
        {" "}
        <Rating
          value={rating}
          name="simple-controlled"
          readOnly
          precision={0.5}
        />
        <span>({rating})</span>
        <Chip
          variant="outlined"
          color="primary"
          size="small"
          label={`Total ${product.reviews.length} reviews / New review`}
          onClick={handleClickOpen}
          icon={<RateReviewIcon />}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Reviews</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            margin: "0 auto",
          }}
        >
          <DialogContentText>All reviews for this product .</DialogContentText>
          <RatingAll reviews={product} />
          <TextField
            id="outlined-multiline-static"
            label="Review"
            multiline
            rows={4}
            name="review"
            value={review.review}
            onChange={handleText}
            variant="outlined"
          />
          <span
            style={{
              margin: "0 auto",
            }}
          >
            Rate
          </span>
          <Rating
            style={{
              margin: "0 auto",
            }}
            value={review.rating}
            name="simple-controlled"
            onChange={(event, newValue) => {
              setReview({ ...review, rating: newValue });
            }}
          />
          {error && <span style={{ color: "red" }}>{error}</span>}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button
            onClick={addReview}
            color="primary"
            variant="contained"
            style={{
              backgroundColor: "#ffc107",
              color: "black",
              padding: "5px",
            }}
          >
            Send Review
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RatingReview;

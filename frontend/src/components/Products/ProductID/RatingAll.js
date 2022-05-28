import React from "react";
import Rating from "@material-ui/lab/Rating";
const RatingAll = ({ reviews }) => {
  return (
    <div>
      <h1>Raitings by users.</h1>
      {reviews.reviews.map((el, index) => {
        return (
          <div key={index}>
            <p>by: {el.user.name}</p>
            <p>Date:{el.createdAt}</p>
            <Rating value={el.rating} readOnly precision={0.5} />{" "}
            <p>{el.review}</p>
          </div>
        );
      })}
    </div>
  );
};

export default RatingAll;

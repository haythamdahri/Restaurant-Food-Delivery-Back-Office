import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReviewModel } from "../models/ReviewModel";
import { APPROVE, DISAPPROVE } from "../services/Constants";
import ReviewService from "../services/ReviewService";
import Swal from "sweetalert2";

export default (props: {review: ReviewModel}) => {

  const [approving, setApproving] = useState(false);
  const [disapproving, setDisapproving] = useState(false);

  const handleReviewStatus = async (status: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
    try {
      // Set loading
      if (status === APPROVE) {
        setApproving(true);
      } else {
        setDisapproving(true);
      }
      const review = await ReviewService.updateReviewStatus(status, props.review.id);
      props.review.approved = review!.approved;
      Toast.fire({
        icon: 'success',
        title: `Review has been ${status === APPROVE ? 'approved' : 'unapproved'} successfully`,
      });
      setApproving(false);
      setDisapproving(false);
    } catch (err) {
      setApproving(false);
      setDisapproving(false);
      Toast.fire({
        icon: 'error',
        title: `An error occurred, please try again!`,
      });
    }
  };

  return (
    <tr>
      <th scope="row">{props.review.id}</th>
      <td align="center">{props.review.user.id}</td>
      <td>{props.review.user.email}</td>
      <td align="center">{props.review.timestamp}</td>
      <td align="center">
        <textarea className="form-control" readOnly value={props.review.comment} />
      </td>
      <td align="center">
        {props.review.approved ? (
          <FontAwesomeIcon icon="check-circle" color="green" />
        ) : (
          <FontAwesomeIcon icon="times-circle" color="red" />
        )}
      </td>
      <td>
          <button
            onClick={(event) => handleReviewStatus(APPROVE)}
            className={`btn btn-success btn-sm font-weight-bold ${
              approving ? "disabled" : ""
            }`}
          >
            {!approving ? (
              <>
                <FontAwesomeIcon icon="check-circle" /> Approve
              </>
            ) : (
              <>
                <div
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>{" "}
                Approving
              </>
            )}
          </button>
        </td>
        <td>
          <button
            onClick={(event) => handleReviewStatus(DISAPPROVE)}
            className={`btn btn-danger btn-sm font-weight-bold ${
              disapproving ? "disabled" : ""
            }`}
          >
            {!disapproving ? (
              <>
                <FontAwesomeIcon icon="times-circle" /> Disapprove
              </>
            ) : (
              <>
                <div
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>{" "}
                Disapproving
              </>
            )}
          </button>
        </td>
    </tr>
  );
};

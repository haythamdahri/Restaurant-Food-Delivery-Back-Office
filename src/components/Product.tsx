import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal, { SweetAlertResult } from "sweetalert2";
import { MealModel } from "../models/MealModel";
import ProductService from "../services/ProductService";
import { IMAGE_URL } from "../services/ConstantsService";
import { Link } from "react-router-dom";

export default (props: { meal: MealModel; setReload: any }) => {
  const [deleting, setDeleting] = useState(false);
  const [undoing, setUndoing] = useState(false);

  const handleProductDelete = async () => {
    // Confirm Meal delete
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then(async (result: SweetAlertResult) => {
      if (result.value) {
        // Perform Meal delete
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        try {
          setDeleting(true);
          await ProductService.deleteProduct(Number(props.meal.id));
          // Set meal as deleted
          props.meal.deleted = true;
          setDeleting(false);
          Toast.fire({
            icon: 'success',
            title: `Product has been deleted successfully!`,
          });
        } catch (err) {
          setDeleting(false);
          console.log(err);
          Toast.fire({
            icon: "error",
            title: `An error occurred, please try again!`,
          });
        }
      }
    });
  };

  const handleProductUndo = async () => {
    // Confirm Meal undo
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to undo product delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then(async (result: SweetAlertResult) => {
      if (result.value) {
        // Perform Meal delete
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        try {
          setUndoing(true);
          await ProductService.UndoProductDelete(Number(props.meal.id));
          // Set meal as deleted
          props.meal.deleted = false;
          setUndoing(false);
          Toast.fire({
            icon: 'success',
            title: `Product has been reset successfully!`,
          });
        } catch (err) {
          setUndoing(false);
          console.log(err);
          Toast.fire({
            icon: "error",
            title: `An error occurred, please try again!`,
          });
        }
      }
    });
  };

  return (
    <tr className={props.meal.deleted ? 'bg-danger text-white font-weight-bold' : ''}>
      <th scope="row">{props.meal.id}</th>
      <td>{props.meal.name}</td>
      <td align="center">
        <img
          src={`${IMAGE_URL}/${props.meal?.image?.id}`}
          alt={props.meal.name}
          style={{ borderRadius: "100%", height: "40px", width: "40px" }}
        />
      </td>
      <td align="center">{props.meal.price} Dhs</td>
      <td align="center">{props.meal.salePrice} Dhs</td>
      <td align="center">{props.meal.stock} Unit</td>
      <td>
        {props.meal.views} <FontAwesomeIcon icon="eye" />
      </td>
      <td align="center">
        <div className="d-inline font-weight-bold">
          <Link to={`/products/save/${props.meal.id}`} className="btn btn-primary btn-sm font-weight-bold">
            <FontAwesomeIcon icon="edit" /> Edit Product
          </Link>
        </div>
      </td>
      <td align="center">
        <button
          disabled={props.meal.deleted}
          onClick={(event) => handleProductDelete()}
          className={`btn btn-danger btn-sm font-weight-bold ${
            deleting ? "disabled" : ""
          }`}
        >
          {!deleting ? (
            <>
              <FontAwesomeIcon icon="times-circle" /> Delete Product
            </>
          ) : (
            <>
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>{" "}
              Deleting Product
            </>
          )}
        </button>
      </td>
      <td align="center">
        <button
          disabled={!props.meal.deleted}
          onClick={(event) => handleProductUndo()}
          className={`btn btn-light btn-sm font-weight-bold ${
            deleting ? "disabled" : ""
          }`}
        >
          {!undoing ? (
            <>
              <FontAwesomeIcon icon="undo" /> Undo Delete
            </>
          ) : (
            <>
              <div
                className="spinner-border spinner-border-sm text-light"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>{" "}
              Undoing Delete
            </>
          )}
        </button>
      </td>
    </tr>
  );
};

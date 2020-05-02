import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import ProductService from "../services/ProductService";
import { MealModel } from "../models/MealModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

interface RouteParams {
  id: string;
}
type FormDataType = {
  name: string;
  price: number;
  salePrice: number;
  views: number;
  stock: number;
  updateImage: boolean;
};
const inputStyle = {
  display: "block",
  width: "100%",
  borderRadius: "2px",
  color: "#686868",
  lineHeight: "1.2",
  WebkitTransition: "all 0.4s",
  OTransition: "all 0.4s",
  MozTransition: "all 0.4s",
  transition: "all 0.4s",
  marginTop: "10px",
  height: "42px",
  outline: "none",
  margin: 0,
  BorderRadius: "0%",
};
export default () => {
  const {
    register,
    handleSubmit,
    errors,
    clearError,
    getValues,
    setError,
  } = useForm<FormDataType>();
  const [loading, setLoading] = useState(true);
  const [mealError, setMealError] = useState(false);
  const [file, setFile] = useState(new File([], ""));
  const [meal, setMeal] = useState(new MealModel());
  const [saving, setSaving] = useState(false);
  let active = true;
  const match = useRouteMatch<{ id: string }>();

  const fetchProduct = async (id: number | null) => {
    setMealError(false);
    setMeal(new MealModel());
    if (id === null || id === undefined) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const meal = await ProductService.getMeal(id);
      if (active === true) {
        setLoading(false);
        setMeal(meal);
      }
    } catch (err) {
      setLoading(false);
      setMealError(true);
    }
  };

  useEffect(() => {
    document.title = "Product Form";
    const id = match.params.id;
    fetchProduct(id !== undefined ? Number(id) : null);
    return () => {
      active = false;
    };
  }, []);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const onSubmit = async (data: FormDataType) => {
    // Verify if data has file in case of update
    if (
      (data.updateImage !== null &&
        data.updateImage === true &&
        (file?.size === 0 || file === undefined || file === null)) ||
      (meal?.id === undefined && file?.size === 0)
    ) {
      Swal.fire(
        "Unvalide product image!",
        "Please select an image for the product before saving!",
        "error"
      );
      return;
    }
    // Set saving
    setSaving(true);
    // Set FormData
    let formData: FormData = new FormData();
    formData.set("image", file);
    formData.set("id", meal.id?.toString() || "");
    formData.set("name", data.name);
    formData.set("price", data.price.toString());
    formData.set("salePrice", data.salePrice.toString());
    formData.set("stock", data.stock.toString());
    formData.set("views", data.views.toString());
    formData.set("updateImage", data.updateImage?.toString() || "false");
    // SEND POST TO SERVER
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
    try {
      setMeal(await ProductService.postProduct(formData));
      setSaving(false);
      Toast.fire({
        icon: 'success',
        title: `Product has been saved successfully!`,
      });
    } catch (err) {
      setSaving(false);
      Toast.fire({
        icon: 'error',
        title: `An error occurred, please try again!`,
      });
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <h5 className="display-4 text-center font-weight-bold text-primary mt-2">
          <FontAwesomeIcon icon="file-medical-alt" /> Product Form |{" "}
          {!mealError && !loading && meal?.id === undefined
            ? "Add New Product"
            : "Edit Product"}
        </h5>
      </div>
      <div className="col-sm-12 col-md-9 col-lg-9 col-xl-9 mx-auto mt-5">
        {loading && (
          <div className="shadow p-3 mb-5 bg-white rounded text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {mealError && (
          <div className="shadow p-3 mb-5 bg-danger rounded text-center text-white">
            <h2 className="font-weight-bold">
              <FontAwesomeIcon icon="exclamation-circle" /> No meal has been
              found!
              <Link to="/products" className="btn btn-light ml-3">
                {" "}
                <FontAwesomeIcon icon="align-left" /> Go To Products
              </Link>
            </h2>
          </div>
        )}
        {!loading && !mealError && (
          <div className="shadow p-3 mb-5 bg-white rounded">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="form-group">
                <label className="font-weight-bold" htmlFor="name">
                  Name:{" "}
                </label>
                <input
                  disabled={saving}
                  style={inputStyle}
                  placeholder="Name ..."
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={meal.name || ""}
                  className={`form-control shadow-sm ${
                    errors.name ? "is-invalid" : ""
                  }`}
                  ref={register({
                    required: true,
                  })}
                />
                {/** Required name error */}
                {errors.name && errors.name.type === "required" && (
                  <div className="invalid-feedback">Name is required</div>
                )}
              </div>
              <div className="form-group">
                <label
                  className="font-weight-bold"
                  htmlFor="validatedCustomFile"
                >
                  Image:{" "}
                </label>
                <div className="custom-file">
                  <input
                    disabled={saving}
                    style={inputStyle}
                    type="file"
                    id="validatedCustomFile"
                    name="file"
                    onChange={handleFileChange}
                    className={`custom-file-input shadow-sm`}
                    accept="image/*"
                  />
                  <label
                    className="custom-file-label shadow-sm"
                    htmlFor="validatedCustomFile"
                  >
                    Choose file...
                  </label>
                </div>
                {meal.id !== undefined && (
                  <div className="custom-control custom-switch mt-2">
                    <input
                      disabled={saving}
                      style={inputStyle}
                      type="checkbox"
                      className="custom-control-input"
                      id="customSwitch1"
                      name="updateImage"
                      ref={register({
                        required: false,
                      })}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customSwitch1"
                    >
                      Update product image
                    </label>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="font-weight-bold" htmlFor="price">
                  Price:{" "}
                </label>
                <input
                  disabled={saving}
                  style={inputStyle}
                  placeholder="Price ..."
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={meal.price || ""}
                  className={`form-control shadow-sm ${
                    errors.price ? "is-invalid" : ""
                  }`}
                  ref={register({
                    required: true,
                    min: 1,
                    max: 2500000,
                  })}
                  onChange={(e) => {
                    const value = e.target.value;
                    // this will clear error by only pass the name of field
                    if (Number(value) > Number(getValues("salePrice")))
                      return clearError("salePrice");
                    // set an error with type and message
                    setError(
                      "salePrice",
                      "notMatch",
                      "Sale price cannot be greater than price!"
                    );
                  }}
                />
                {/** Required price error */}
                {errors.price && errors.price.type === "required" && (
                  <div className="invalid-feedback">Price is required</div>
                )}
                {/** Min or Max Price error */}
                {errors.price &&
                  (errors.price?.type === "min" ||
                    errors.price?.type === "max") && (
                    <div className="invalid-feedback">Invalid price value</div>
                  )}
              </div>
              <div className="form-group">
                <label className="font-weight-bold" htmlFor="salePrice">
                  Sale Price:{" "}
                </label>
                <input
                  disabled={saving}
                  style={inputStyle}
                  placeholder="Sale Price ..."
                  type="number"
                  id="salePrice"
                  name="salePrice"
                  defaultValue={meal.salePrice || ""}
                  className={`form-control shadow-sm ${
                    errors.salePrice ? "is-invalid" : ""
                  }`}
                  ref={register({
                    required: true,
                    min: 1,
                    max: 2500000,
                  })}
                  onChange={(e) => {
                    const value = e.target.value;
                    // this will clear error by only pass the name of field
                    if (
                      getValues("price").toString() !== "" &&
                      Number(value) < Number(getValues("price"))
                    )
                      return clearError("salePrice");
                    // set an error with type and message
                    setError(
                      "salePrice",
                      "notMatch",
                      "Sale price cannot be greater than price!"
                    );
                  }}
                />
                {/** Required Sale Price error */}
                {errors.salePrice && errors.salePrice.type === "required" && (
                  <div className="invalid-feedback">Sale Price is required</div>
                )}
                {/** Required Sale Price error */}
                {errors.salePrice && errors.salePrice.type === "notMatch" && (
                  <div className="invalid-feedback">
                    {errors.salePrice.message}
                  </div>
                )}
                {/** Min or Max Sale Price error */}
                {errors.salePrice &&
                  (errors.salePrice?.type === "min" ||
                    errors.salePrice?.type === "max") && (
                    <div className="invalid-feedback">
                      Invalid sale price value
                    </div>
                  )}
              </div>
              <div className="form-group">
                <label className="font-weight-bold" htmlFor="stock">
                  Stock:{" "}
                </label>
                <input
                  disabled={saving}
                  style={inputStyle}
                  placeholder="Stock ..."
                  type="number"
                  id="stock"
                  name="stock"
                  defaultValue={meal.stock || ""}
                  className={`form-control shadow-sm ${
                    errors.stock ? "is-invalid" : ""
                  }`}
                  ref={register({
                    required: true,
                    min: 1,
                    max: 2500000,
                  })}
                />
                {/** Required Stock error */}
                {errors.stock && errors.stock.type === "required" && (
                  <div className="invalid-feedback">Stock is required</div>
                )}
                {/** Min or Max Stock error */}
                {errors.stock &&
                  (errors.stock.type === "min" ||
                    errors.stock?.type === "max") && (
                    <div className="invalid-feedback">Invalid stock value</div>
                  )}
              </div>
              <div className="form-group">
                <label className="font-weight-bold" htmlFor="views">
                  Views:{" "}
                </label>
                <input
                  disabled={saving}
                  style={inputStyle}
                  placeholder="Views ..."
                  type="number"
                  id="views"
                  name="views"
                  defaultValue={meal.views || ""}
                  className={`form-control shadow-sm ${
                    errors.views ? "is-invalid" : ""
                  }`}
                  ref={register({
                    required: true,
                    min: 1,
                    max: 25000,
                  })}
                />
                {/** Required Stock error */}
                {errors.views && errors.views.type === "required" && (
                  <div className="invalid-feedback">Views is required</div>
                )}
                {/** Min or Max Stock error */}
                {errors.views &&
                  (errors.views.type === "min" ||
                    errors.views?.type === "max") && (
                    <div className="invalid-feedback">Invalid views value</div>
                  )}
              </div>
              <button
                disabled={saving}
                type="submit"
                className="btn btn-primary font-weight-bold text-center btn-block"
              >
                {saving ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>{" "}
                    Saving
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon="save" /> Save
                  </>
                )}
              </button>
              <Link
                to="/products"
                type="submit"
                className="btn btn-warning font-weight-bold text-center btn-block"
              >
                <FontAwesomeIcon icon="undo" /> Cancel, Go To Products
              </Link>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

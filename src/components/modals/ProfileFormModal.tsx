import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserModel } from "../../models/UserModel";
import { useForm } from "react-hook-form";
import Swal, { SweetAlertResult } from "sweetalert2";
import UserService from "../../services/UserService";
import { FILES_ENDOINT } from "../../services/ConstantsService";
import AuthService from "../../services/AuthService";
import { useHistory } from "react-router-dom";
import { act } from "react-dom/test-utils";

type FormDataType = {
  email: string;
  username: string;
  location: string;
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

export default (props: { user: UserModel; setUser: any; active: boolean }) => {
  const { register, handleSubmit, errors } = useForm<FormDataType>();
  const [saving, setSaving] = useState(false);
  const [isSignedOut, setIsSignedOut] = useState(false);
  const { user, setUser, active } = props;
  const closeBtn = useRef(null);
  let history = useHistory();

  useEffect(() => {
    if (isSignedOut) {
      history.push("/signin");
    }
  }, [isSignedOut]);

  const onSubmit = async (data: FormDataType) => {
    // Give user confirm message if email will be changed
    if (data.email !== user.email) {
      Swal.fire({
        title: "Your session will be lost after email update?",
        text: "Do you want proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!",
        cancelButtonText: "No, cancel",
      }).then(async (result: SweetAlertResult) => {
        if (result.value) {
          proceedUserEdit(data);
        }
      });
    } else {
      proceedUserEdit(data);
    }
  };

  const proceedUserEdit = async (data: FormDataType) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
    if (active) {
      setSaving(true);
    }
    try {
      const newUser = await UserService.saveUser(
        user.id,
        data.email,
        data.username,
        data.location
      );
      newUser.image.file = FILES_ENDOINT + "/" + user.image.id;
      if (active) {
        // Check if email is changed then sign out the current user
        if (user.email !== newUser.email) {
          ((closeBtn.current as unknown) as HTMLButtonElement).click();
          AuthService.signout();
          setIsSignedOut(true);
        } else {
          ((closeBtn.current as unknown) as HTMLButtonElement).click();
          setUser(newUser);
        }
      }
      Toast.fire({
        icon: "success",
        title: `Your profile has been updated successfully!`,
      });
    } catch (err) {
      if (active) {
        setSaving(false);
      }
      Toast.fire({
        icon: "error",
        title: `${err.message}`,
      });
    } finally {
      if (active) {
        setSaving(false);
      }
    }
  };

  return (
    <div
      className="modal fade"
      id={"profiletModel"}
      tabIndex={-1}
      role="dialog"
      aria-labelledby={"profileModel"}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              className="modal-title font-weight-bold"
              id="exampleModalCenterTitle"
            >
              <FontAwesomeIcon icon="file-medical-alt" /> Profile Edit
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label className="font-weight-bold" htmlFor="name">
                  Email:{" "}
                </label>
                <input
                  disabled={saving}
                  style={inputStyle}
                  placeholder="Email ..."
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={user.email || ""}
                  className={`form-control shadow-sm ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  ref={register({
                    required: true,
                  })}
                />
                {/** Required email error */}
                {errors.email && errors.email.type === "required" && (
                  <div className="invalid-feedback">Email is required</div>
                )}
              </div>
              <div className="form-group">
                <label className="font-weight-bold" htmlFor="name">
                  Username:{" "}
                </label>
                <input
                  disabled={saving}
                  style={inputStyle}
                  placeholder="Username ..."
                  type="text"
                  id="username"
                  name="username"
                  defaultValue={user.username || ""}
                  className={`form-control shadow-sm ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  ref={register({
                    required: true,
                  })}
                />
                {/** Required username error */}
                {errors.username && errors.username.type === "required" && (
                  <div className="invalid-feedback">Username is required</div>
                )}
              </div>
              <div className="form-group">
                <label className="font-weight-bold" htmlFor="name">
                  Location:{" "}
                </label>
                <input
                  disabled={saving}
                  style={inputStyle}
                  placeholder="Location ..."
                  type="text"
                  id="location"
                  name="location"
                  defaultValue={user.location || ""}
                  className={`form-control shadow-sm ${
                    errors.location ? "is-invalid" : ""
                  }`}
                  ref={register({
                    required: true,
                  })}
                />
                {/** Required location error */}
                {errors.location && errors.location.type === "required" && (
                  <div className="invalid-feedback">Location is required</div>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-block btn-sm btm-sm font-weight-bold"
              >
                {saving ? (
                  <div
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon="save" /> Save
                  </>
                )}
              </button>
            </form>
          </div>
          <div className="modal-footer">
            <button
              ref={closeBtn}
              type="button"
              className="btn btn-dark btm-sm font-weight-bold btn-sm"
              data-dismiss="modal"
            >
              <FontAwesomeIcon icon="times-circle" /> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

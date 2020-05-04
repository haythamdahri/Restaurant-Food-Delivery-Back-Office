import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { ContactMessageModel } from "../../models/ContactMessageModel";
import ContactMessageService from "../../services/ContactMessageService";

type FormDataType = {
  message: string
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
  outline: "none",
  margin: 0,
  BorderRadius: "0%",
};

export default (props: { contactMessage: ContactMessageModel, setContactMessage: any }) => {
  const { register, handleSubmit, errors } = useForm<FormDataType>();
  const [saving, setSaving] = useState(false);
  const closeBtn = useRef(null);
  const {contactMessage, setContactMessage} = props;

  useEffect(() => {
  }, []);

  const onSubmit = async (data: FormDataType) => {
    setSaving(true);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
    // Response to contact message
    try {
      const newContactMessage = await ContactMessageService.respondContactMessages(contactMessage.id, data.message);
      Toast.fire({
        icon: "success",
        title: `Message has been responded successfully`,
      });
      setContactMessage(newContactMessage);
      (closeBtn.current as unknown as HTMLButtonElement).click();
    } catch(err) {
      Toast.fire({
        icon: "error",
        title: `An error occurred, please try again!`,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal fade"
      id={"contactMessage" + contactMessage.id}
      tabIndex={-1}
      role="dialog"
      aria-labelledby={"contactMessage"}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              className="modal-title font-weight-bold"
              id="exampleModalCenterTitle"
            >
              <FontAwesomeIcon icon="file-medical-alt" /> Message Support
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
                  Message:{" "}
                </label>
                <textarea
                  rows={10}
                  disabled={saving}
                  style={inputStyle}
                  placeholder="Message ..."
                  id="message"
                  name="message"
                  className={`form-control shadow-sm ${
                    errors.message ? "is-invalid" : ""
                  }`}
                  ref={register({
                    required: true,
                  })}
                />
                {/** Required email error */}
                {errors.message && errors.message.type === "required" && (
                  <div className="invalid-feedback">Message is required</div>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-light btn-block btn-sm btm-sm font-weight-bold"
              >
                {saving ? (
                  <>
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div> Saving
                  </>
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

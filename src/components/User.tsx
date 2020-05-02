import React, { useState } from "react";
import { UserModel } from "../models/UserModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserService from "../services/UserService";
import { ENABLE, DISABLE } from "../services/ConstantsService";
import Swal from 'sweetalert2'

export default (props: { user: UserModel; setReload: any }) => {
  const [enabling, setEnabling] = useState(false);
  const [disabling, setDisabling] = useState(false);

  const handleAccountStatus = async (status: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
    try {
      // Set loading
      if (status === ENABLE) {
        setEnabling(true);
      } else {
        setDisabling(true);
      }
      const user = await UserService.updateAcountStatus(status, props.user.id);
      props.user.enabled = user!.enabled;
      Toast.fire({
        icon: 'success',
        title: `Account has been ${status === ENABLE ? 'enabled' : 'disabled'} successfully`,
      });
      setEnabling(false);
      setDisabling(false);
    } catch (err) {
      setEnabling(false);
      setDisabling(false);
      Toast.fire({
        icon: 'error',
        title: `An error occurred, please try again!`,
      });
    }
  };

  return (
      <tr>
        <th scope="row">{props.user.id}</th>
        <td>{props.user.email}</td>
        <td>{props.user.username}</td>
        <td align="center">
          {props.user.enabled ? (
            <FontAwesomeIcon icon="check-circle" color="green" />
          ) : (
            <FontAwesomeIcon icon="times-circle" color="red" />
          )}
        </td>
        <td>{props.user.location}</td>
        <td align="center">
          {props.user.roles.map((role, index) => {
            return (
              <p className="font-weight-bold" key={index}>
                {role.roleName.toString().substring(5)}
              </p>
            );
          })}
        </td>
        <td align="center">
          <button
            onClick={(event) => handleAccountStatus(ENABLE)}
            className={`btn btn-success btn-sm font-weight-bold ${
              enabling ? "disabled" : ""
            }`}
          >
            {!enabling ? (
              <>
                <FontAwesomeIcon icon="check-circle" /> Enable Account
              </>
            ) : (
              <>
                <div
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>{" "}
                Enabling Account
              </>
            )}
          </button>
        </td>
        <td align="center">
          <button
            onClick={(event) => handleAccountStatus(DISABLE)}
            className={`btn btn-danger btn-sm font-weight-bold ${
              disabling ? "disabled" : ""
            }`}
          >
            {!disabling ? (
              <>
                <FontAwesomeIcon icon="times-circle" /> Disable Account
              </>
            ) : (
              <>
                <div
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>{" "}
                Disabling Account
              </>
            )}
          </button>
        </td>
      </tr>
  );
};

import React, { useRef, useState } from "react";
import { UserModel } from "../models/UserModel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserService from "../services/UserService";
import { ENABLE, DISABLE } from "../services/Constants";

export default (props: { user: UserModel; setReload: any }) => {
  const [enabling, setEnabling] = useState(false);
  const [disabling, setDisabling] = useState(false);

  const handleAccountStatus = async (status: string) => {
    try {
      // Set loading
      if (status === ENABLE) {
        setEnabling(true);
      } else {
        setDisabling(true);
      }
      await UserService.updateAcountStatus(status, props.user.id);
      props.user.enabled = status === ENABLE ? true : false;
      setEnabling(false);
      setDisabling(false);
    } catch (err) {
      setEnabling(false);
      setDisabling(false);
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
      <td>
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
      <td>
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

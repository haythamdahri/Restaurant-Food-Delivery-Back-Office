import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PaymentModel } from "../models/PaymentModel";
import Moment from "react-moment";

export default (props: {payment: PaymentModel}) => {

  return (
    <tr>
      <th scope="row">{props.payment.id}</th>
      <td align="center">{props.payment.user.id}</td>
      <td>{props.payment.user.email}</td>
      <td>{props.payment.user.username}</td>
      <td align="center">{props.payment.order.id}</td>
      <td align="center">{props.payment.order.totalPrice} Dhs</td>
      <td align="center">
        {props.payment.order.delivered ? (
          <FontAwesomeIcon icon="check-circle" color="green" />
        ) : (
          <FontAwesomeIcon icon="times-circle" color="red" />
        )}
      </td>
      <td align="center">
        {props.payment.order.cancelled ? (
          <FontAwesomeIcon icon="check-circle" color="green" />
        ) : (
          <FontAwesomeIcon icon="times-circle" color="red" />
        )}
      </td>
      <td><Moment format="YYYY/MM/DD HH:mm:ss" date={props.payment.order.time} /></td>
      <td><Moment format="YYYY/MM/DD HH:mm:ss" date={props.payment.timestamp} /></td>
    </tr>
  );
};

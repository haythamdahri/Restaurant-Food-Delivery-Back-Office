import React, { useRef } from 'react';
import { UserModel } from '../models/UserModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserService from '../services/UserService';
import {ENABLE, DISABLE} from '../services/Constants';

export default (props: {user: UserModel, setReload: any}) => {

    const enableBtn = useRef<HTMLButtonElement>(null);
    const disableBtn = useRef<HTMLButtonElement>(null);

    const handleAccountStatus = async (status: string) => {
        try {
            // Disable buttons
            (enableBtn.current as HTMLButtonElement).setAttribute('disabled', 'true');
            (disableBtn.current as HTMLButtonElement).setAttribute('disabled', 'true');
            await UserService.updateAcountStatus(status, props.user.id);
            props.setReload(Date.now);
        } catch(err) {
            (enableBtn.current as HTMLButtonElement).removeAttribute('disabled');
            (disableBtn.current as HTMLButtonElement).removeAttribute('disabled');
        }
    }

    return (
        <tr>
            <th scope="row">{props.user.id}</th>
            <td>{props.user.email}</td>
            <td>{props.user.username}</td>
            <td align="center">{props.user.enabled ? <FontAwesomeIcon icon="check-circle" color="green" /> 
                : <FontAwesomeIcon icon="times-circle" color="red" />}</td>
            <td>{props.user.location}</td>
            <td align="center">
                    {props.user.roles.map((role, index) => {
                        return <p className="font-weight-bold" key={index}>{role.roleName.toString().substring(5)}</p>
                    })}
            </td>
            <td>
                <button ref={enableBtn} onClick={(event) => handleAccountStatus(ENABLE)} className="btn btn-success btn-sm font-weight-bold"> <FontAwesomeIcon icon="check-circle" /> Enable Account</button>
            </td>
            <td>
                <button ref={disableBtn} onClick={(event) => handleAccountStatus(DISABLE)} className="btn btn-danger btn-sm font-weight-bold"> <FontAwesomeIcon icon="times-circle" /> Disable Account</button>
            </td>
        </tr>
    );

}
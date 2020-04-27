import React, { useEffect, useState } from "react";
import User from "./User";
import { UserModel } from "../models/UserModel";
import UserService from "../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default () => {
  const [users, setUsers] = useState(new Array<UserModel>());
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(Date.now);

  useEffect(() => {
    document.title = "Users";
    let isCancelled = false;
    const fetchData = async () => {
      try {
        // Init data
        setUsers([]);
        setLoading(true);
        const users = await UserService.getUsers();
        if (!isCancelled) {
          setUsers(users);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [reload]);

  return (
    <div className="row">
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 mx-auto mt-4 mb-4"></div>
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 mx-auto">
        <div className="table-responsive">
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Email</th>
                <th scope="col">Username</th>
                <th scope="col">Enabled</th>
                <th scope="col">Location</th>
                <th
                  style={{ justifyContent: "center", textAlign: "center" }}
                  scope="col">Roles</th>
                <th
                  style={{ justifyContent: "center", textAlign: "center" }}
                  scope="col"
                  colSpan={2}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="text-center bg-light">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center alert alert-dark">
                    <h2 className="font-weight-bold">
                      <FontAwesomeIcon icon="exclamation-circle" /> No users
                      found!
                    </h2>
                  </td>
                </tr>
              )}
              {users.map((user, index) => {
                return <User key={index} user={user} setReload={setReload} />;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import User from "./User";
import { UserModel } from "../models/UserModel";
import UserService from "../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";

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
type FormData = {
  search: string;
};
export default () => {
  const [users, setUsers] = useState(new Array<UserModel>());
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(Date.now);
  const { register, handleSubmit, errors } = useForm<FormData>();
  let isCancelled = false;

  const fetchData = async (search: string = '') => {
    try {
      // Init data
      setUsers([]);
      setLoading(true);
      const users = await UserService.getUsers(search);
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

  useEffect(() => {
    document.title = "Users";
    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [reload]);

  const onSearchSubmit = (data: {search: string}) => {
    // Search users
    fetchData(data.search);
  }

  return (
    <div className="row">
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 mx-auto mt-4 mb-4">
        <form onSubmit={handleSubmit(onSearchSubmit)}>
          <div className="form-row">
            <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 mx-auto">
              <input
                style={inputStyle}
                type="search"
                className={`form-control ${errors.search ? "is-invalid" : ""}`}
                id="userSearch"
                placeholder="Search user by id, name, email ...."
                ref={register({
                  required: false
                })}
                name="search"
              />
            </div>
            <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 mx-auto">
              <button type="submit" className="btn btn-warning btn-block font-weight-bold">
                <FontAwesomeIcon icon="search-dollar" /> Search
              </button>
            </div>
          </div>
        </form>
      </div>
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
                  scope="col"
                >
                  Roles
                </th>
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

import React, { useEffect, useState, useRef } from "react";
import User from "./User";
import { UserModel } from "../models/UserModel";
import UserService from "../services/UserService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "../pagination/Page";
import CustomPagination from "../pagination/components/custom-pagination/CustomPagination";
import CustomPaginationService from "../pagination/services/CustomPaginationService";

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
type FormData = {
  search: string;
};
export default () => {
  const searchInput = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(Date.now);
  let isCancelled = false;
  const [page, setPage] = useState(new Page<UserModel>());
  const fetchData = async () => {
    try {
      const search = ((searchInput.current as unknown) as HTMLInputElement)
        .value;
      // Init data
      if (!isCancelled) {
        setPage(new Page<UserModel>());
        setLoading(true);
        setError(false);
        const usersPage = await UserService.getBasicUsersPage(
          search,
          page.pageable
        );
        setPage(usersPage);
        setLoading(false);
      }
    } catch (err) {
      if (!isCancelled) {
        setLoading(false);
        setError(true);
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

  const getNextPage = () => {
    page.pageable = CustomPaginationService.getNextPage(page);
    fetchData();
  };

  const getPreviousPage = () => {
    page.pageable = CustomPaginationService.getPreviousPage(page);
    fetchData();
  };

  const getPageInNewSize = (pageSize: number) => {
    page.pageable = CustomPaginationService.getPageInNewSize(page, pageSize);
    fetchData();
  };

  const onSearchSubmit = async (event: any) => {
    event.preventDefault();
    // Search users
    getPageInNewSize(20);
  };

  return (
    <div className="row">
      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 mx-auto mt-4 mb-4">
        <form onSubmit={onSearchSubmit}>
          <div className="form-row">
            <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 mx-auto">
              <input
                style={inputStyle}
                type="search"
                id="userSearch"
                placeholder="Search user by username, email, location ...."
                name="search"
                className="form-control"
                ref={searchInput}
              />
            </div>
            <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 mx-auto">
              <button
                type="submit"
                className="btn btn-warning btn-block font-weight-bold"
              >
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
              {!loading && page?.content?.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center alert alert-dark">
                    <h2 className="font-weight-bold">
                      <FontAwesomeIcon icon="exclamation-circle" /> No users
                      found!
                    </h2>
                  </td>
                </tr>
              )}
              {error === true && (
                <tr>
                  <td colSpan={8} className="text-center alert alert-warning">
                    <h2 className="font-weight-bold">
                      <FontAwesomeIcon icon="exclamation-circle" /> An error occurred! 
                        <button onClick={fetchData} className="btn btn-warning font-weight-bold ml-2">
                        <FontAwesomeIcon icon="sync" /> Reload
                        </button>
                    </h2>
                  </td>
                </tr>
              )}
              {page?.content?.map((user, index) => {
                return <User key={index} user={user} setReload={setReload} />;
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-12 text-center">
        <CustomPagination
          page={page}
          loading={loading}
          nextPageEvent={getNextPage}
          previousPageEvent={getPreviousPage}
          pageSizeEvent={getPageInNewSize}
        />
      </div>
    </div>
  );
};

import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "../pagination/Page";
import CustomPagination from "../pagination/components/custom-pagination/CustomPagination";
import CustomPaginationService from "../pagination/services/CustomPaginationService";
import ProductService from "../services/ProductService";
import { MealModel } from "../models/MealModel";
import Product from "./Product";
import { Link } from "react-router-dom";

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
  const searchInput = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(Date.now);
  let isCancelled = false;
  const [page, setPage] = useState(new Page<MealModel>());
  const fetchData = async () => {
    try {
      const search = ((searchInput.current as unknown) as HTMLInputElement)
        .value;
      // Init data
      if (!isCancelled) {
        setPage(new Page<MealModel>());
        setLoading(true);
        setError(false);
        const productsPage = await ProductService.getMealsPage(
          search,
          page.pageable
        );
        setPage(productsPage);
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
    document.title = "Products";
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
      <div className="col-6 text-center mx-auto mt-3">
        <Link to={`/products/save`} className="btn btn-outline-primary btn-sm btn-block font-weight-bold" 
            style={{border: '1.5px solid blue', borderRadius: '40px'}}>
          <FontAwesomeIcon icon="plus-circle" /> Add Product
        </Link>
      </div>

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
                <th scope="col">Name</th>
                <th style={{ justifyContent: "center", textAlign: "center" }}
                  scope="col">Image</th>
                <th style={{ justifyContent: "center", textAlign: "center" }}
                  scope="col">Price</th>
                <th style={{ justifyContent: "center", textAlign: "center" }}
                  scope="col">Sale Price</th>
                <th style={{ justifyContent: "center", textAlign: "center" }}
                  scope="col">Stock</th>
                <th scope="col">Views</th>
                <th style={{ justifyContent: "center", textAlign: "center" }}
                  scope="col" colSpan={3}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={10} className="text-center bg-light">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && page?.content?.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center alert alert-dark">
                    <h2 className="font-weight-bold">
                      <FontAwesomeIcon icon="exclamation-circle" /> No meals
                      found!
                    </h2>
                  </td>
                </tr>
              )}
              {error === true && (
                <tr>
                  <td colSpan={10} className="text-center alert alert-warning">
                    <h2 className="font-weight-bold">
                      <FontAwesomeIcon icon="exclamation-circle" /> An error occurred! 
                        <button onClick={fetchData} className="btn btn-warning font-weight-bold ml-2">
                        <FontAwesomeIcon icon="sync" /> Reload
                        </button>
                    </h2>
                  </td>
                </tr>
              )}
              {page?.content?.map((meal, index) => {
                return <Product key={index} meal={meal} setReload={setReload} />;
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

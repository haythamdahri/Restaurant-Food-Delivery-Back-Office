import React, { useEffect, useRef, useState } from "react";
import CustomPaginationService from "../pagination/services/CustomPaginationService";
import { ContactMessageModel } from "../models/ContactMessageModel";
import { Page } from "../pagination/Page";
import ContactMessageService from "../services/ContactMessageService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CustomPagination from "../pagination/components/custom-pagination/CustomPagination";
import SupportFormModal from "./modals/SupportFormModal";
import Moment from "react-moment";

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

export default () => {
  const searchInput = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(Date.now);
  let isCancelled = false;
  const [page, setPage] = useState(new Page<ContactMessageModel>());
  const fetchData = async () => {
    try {
      const search = ((searchInput.current as unknown) as HTMLInputElement)
        .value;
      // Init data
      if (!isCancelled) {
        setPage(new Page<ContactMessageModel>());
        setLoading(true);
        setError(false);
        const contactMessagesPage = await ContactMessageService.getContactMessages(
          search,
          page.pageable
        );
        setPage(contactMessagesPage);
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
    document.title = "Support";
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

  const onContactMessageUpdate = (contactMessage: ContactMessageModel) => {
    let newPage = Object.assign({}, page);
    newPage.content = page.content.map((tempContactMessage, index) => {
        if( tempContactMessage.id === contactMessage.id ) {
            return contactMessage;
        }
        return tempContactMessage
    });
    setPage(newPage);
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
                placeholder="Search message ..."
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
        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {!loading && page?.content?.length === 0 && (
          <div className="text-center alert alert-dark">
            <h2 className="font-weight-bold">
              <FontAwesomeIcon icon="exclamation-circle" /> No messages found!
            </h2>
          </div>
        )}
        {error === true && (
          <div className="text-center alert alert-warning">
            <h2 className="font-weight-bold">
              <FontAwesomeIcon icon="exclamation-circle" /> An error occurred!
              <button
                onClick={fetchData}
                className="btn btn-warning font-weight-bold ml-2"
              >
                <FontAwesomeIcon icon="sync" /> Reload
              </button>
            </h2>
          </div>
        )}
        {page?.content?.map((contactMessage, index) => {
          return (
            <div key={index}>
              <SupportFormModal
                contactMessage={contactMessage}
                setContactMessage={onContactMessageUpdate}
              />
              <div className="card shadow rounded mt-3 mb-3">
                <div className="card-body">
                  <h5 className="card-title font-weight-bold">
                    <FontAwesomeIcon icon="signature" /> {contactMessage.firstName} {contactMessage.lastName} {" "}{" "}
                    <label className="text-secondary">|</label>{" "}{" "}
                    <FontAwesomeIcon icon="envelope" /> {contactMessage.email} {" "}{" "}
                    <label className="text-secondary">|</label> {" "}{" "}
                    <FontAwesomeIcon icon="phone" /> {contactMessage.phone}{" "}{" "}
                  </h5>
                  <p className="card-text">{contactMessage.content}</p>
                  <p className="text-center">
                    {contactMessage.responded ? (
                      <small className="text-muted">
                        <FontAwesomeIcon icon="check-circle" color="green" />{" "}
                        Responded
                      </small>
                    ) : (
                      <small className="text-muted">
                        <FontAwesomeIcon icon="times-circle" color="red" /> Not
                        Responded
                      </small>
                    )}
                  </p>
                  <p className="text-center">
                    <Moment
                      format="YYYY/MM/DD HH:mm:ss"
                      date={contactMessage.time}
                    />
                  </p>
                  {!contactMessage.responded && (
                    <p className="text-center">
                      <button
                        type="button"
                        data-toggle="modal"
                        data-target={"#contactMessage" + contactMessage.id}
                        className="btn btn-primary w-50 font-weight-bold"
                      >
                        <FontAwesomeIcon icon="reply" /> Reply
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
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

import React from 'react';
import { Page } from "../../Page";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default (props: {
  page: Page<any>,
  loading: boolean, 
  nextPageEvent: any, 
  previousPageEvent: any,
  pageSizeEvent: any}) => {

  const nextPage = () => {
    props.nextPageEvent();
  }

  const previousPage = () => {
    props.previousPageEvent();
  }

  const updatePageSize = (pageSize: number) => {
    props.pageSizeEvent(pageSize);
  }

  return (
    <div className="card-actions align-items-center d-flex justify-content-center">
        <span className="align-self-center mb-1 mx-1 text-muted">Elements per page:</span>
        <div className="dropdown">
          <button aria-expanded="false" aria-haspopup="true"
            data-toggle="dropdown"
            type="button"
            className={`btn btn-outline dropdown-toggle ${props?.loading ? 'disabled' : ''}`}>
            {props?.page?.size}
          </button>
          <div className="dropdown-menu dropdown-menu-right menu">
            <span className="dropdown-item active" onClick={event => updatePageSize(5)}>5</span>
            <span className="dropdown-item" onClick={event => updatePageSize(20)}>20</span>
            <span className="dropdown-item" onClick={event => updatePageSize(100)}>100</span>
          </div>
        </div>
        <span className="align-self-center mb-1 mr-2 text-muted">
          Shows {props?.page?.numberOfElements} of {props?.page?.totalElements}
        </span>
        <span 
          className={`btn btn-outline ${props?.page?.first || props?.loading ? 'disabled' : ''}`}
          onClick={event => previousPage()}>
          <FontAwesomeIcon icon="angle-double-left" />
        </span>
        <span 
          className={`btn btn-outline ${props?.page?.last || props?.loading ? 'disabled' : ''}`}
          onClick={event => nextPage()}>
          <FontAwesomeIcon icon="angle-double-right" />
        </span>
    </div>
  )

}

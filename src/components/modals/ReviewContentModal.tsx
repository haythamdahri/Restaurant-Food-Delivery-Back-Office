import React from 'react';
import { ReviewModel } from '../../models/ReviewModel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default (review: ReviewModel) => {
  return (
    <div className="modal fade" id={"contentModel" + review.id} tabIndex={-1} role="dialog" aria-labelledby={'contentModel' + review.id} aria-hidden="true">
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title font-weight-bold" id="exampleModalCenterTitle"><FontAwesomeIcon icon="file-medical-alt" /> Review Content</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p style={{minHeight: '20vh'}} className="lead">{review.comment}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-light btm-sm font-weight-bold btn-block" data-dismiss="modal"> 
              <FontAwesomeIcon icon="times-circle" /> Close
            </button>
          </div>
        </div>
      </div>
    </div>
      );

}
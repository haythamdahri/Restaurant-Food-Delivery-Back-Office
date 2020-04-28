import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default () => {
  
  useEffect(() => {
    // Set document title
    document.title = "You are not authroized";
  })

  return (
    <div className="col-12">
      <div className="shadow-lg p-3 mb-5 bg-warning rounded mt-5 text-center font-weight-bold display-4">
        <FontAwesomeIcon icon="exclamation" /> You are not authorized to access
        this page
      </div>
    </div>
  );
};

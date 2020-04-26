import React, { useEffect } from "react";

export default () => {
  useEffect(() => {
    document.title = "Profile";
  });

  return <div className="display-4">Profile</div>;
};

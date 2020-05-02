import React, { useEffect, useState, useRef } from "react";
import { UserModel } from "../models/UserModel";
import UserService from "../services/UserService";
import { FILES_ENDOINT } from "../services/ConstantsService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ProfileFormModal from "./modals/ProfileFormModal";
import FsLightbox from "fslightbox-react";
import cover from "../cover.jpg";

const profileStyle = {
  background: `url(${cover}) no-repeat center`,
  backgroundSize: "cover",
  height: '300px',
  width: '100%'
};

export default () => {
  const [user, setUser] = useState(new UserModel());
  const [loading, setLoading] = useState(true);
  const [toggler, setToggler] = useState(true);
  const [updatingImage, setUpdatingImage] = useState(false);
  const [error, setError] = useState(false);
  const uploadRef = useRef(null);
  let active = true;

  const fetchUser = async () => {
    try {
      if (active) {
        setLoading(true);
        setError(false);
      }
      const user = await UserService.getAuthenticatedUserDetails();
      user.image.file = FILES_ENDOINT + "/" + user.image.id;
      if (active) {
        setUser(user);
        setError(false);
      }
    } catch (err) {
      if (active) {
        setError(true);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    document.title = "Profile";
    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  const handleFileChange = async (event: any) => {
    setUpdatingImage(true);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
    });
    const formData: FormData = new FormData();
    formData.append("image", event.target.files[0]);
    try {
      const response = await UserService.updateUserImage(formData);
      response.user.image.file = `${FILES_ENDOINT}/${
        user.image.id
      }?time=${Date.now()}`;
      if (active) {
        setUser(response.user);
      }
      Toast.fire({
        icon: "success",
        title: `Image has been updated successfully!`,
      });
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: `An error occurred, please try again!`,
      });
    } finally {
      setUpdatingImage(false);
    }
  };

  return (
    <div className="row mt-4">
      {active && (
        <ProfileFormModal user={user} setUser={setUser} active={active} />
      )}

      {loading && !error && (
        <div className="col-sm-12 col-md-10 p-5 col-lg-10 col-xl-10 mx-auto shadow rounded text-center">
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow text-success" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow text-danger" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow text-warning" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow text-info" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow text-light" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow text-dark" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="text-primary display-4 font-weight-bold text-center">
            Loading Profile ...
          </div>
        </div>
      )}
      {!loading && error && (
        <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 shadow rounded mx-auto">
          <div className="shadow p-3 mb-5 bg-danger rounded text-center text-white mt-5">
            <h2 className="font-weight-bold">
              <FontAwesomeIcon icon="exclamation-circle" /> An error occurred
              <button className="btn btn-light ml-3" onClick={fetchUser}>
                {" "}
                <FontAwesomeIcon icon="sync" /> Retry
              </button>
            </h2>
          </div>
        </div>
      )}
      {!loading && !error && (
        <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10 shadow rounded mx-auto">
          <div className="row">
            <div
              className="col-12 text-center"
              style={profileStyle}
            >
              <img
                src={user?.image.file}
                style={{ maxHeight: "150px", height: '100%', width: '150px', cursor: "pointer" }}
                alt={user.username}
                className="img-thumbnail  shadow rounded mt-5"
                onClick={() => setToggler(!toggler)}
              />
              <FsLightbox toggler={toggler} sources={[user.image.file]} />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="custom-file-input hidden"
                    id="validatedCustomFile"
                    accept="image/*"
                    ref={uploadRef}
                  />
                  <button disabled={updatingImage} onClick={e => (uploadRef.current as unknown as HTMLElement).click()} className="btn btn-light btn-sm font-weight-bold text-center">
                    {!updatingImage ? (
                      <>
                        <FontAwesomeIcon icon="upload" /> Change picture
                      </>
                    ) : (
                      <>
                        <div className="spinner-border spinner-border-sm spinner-border" role="status">
                          <span className="sr-only">Loading...</span> 
                        </div> Uploading picture
                      </>
                    )}
                  </button>
            </div>
            <div className="col-12 text-center">
              <div className="w-100 shadow-sm p-1 mb-3 bg-light rounded"></div>
              <div className="row mt-3 mb-3">
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 font-weight-bold">
                  <FontAwesomeIcon icon="user-circle" /> Username:
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mx-auto">
                  {user.username}
                </div>
              </div>
              <div className="w-100 shadow-sm p-1 mb-3 bg-light rounded"></div>
              <div className="row mt-3 mb-3">
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 font-weight-bold">
                  <FontAwesomeIcon icon="envelope" /> Email:
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mx-auto">
                  {user.email}
                </div>
              </div>
              <div className="w-100 shadow-sm p-1 mb-3 bg-light rounded"></div>
              <div className="row mt-3 mb-3">
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 font-weight-bold">
                  <FontAwesomeIcon icon="map-marker" /> Location:
                </div>
                <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 mx-auto">
                  {user.location}
                </div>
              </div>
            </div>
            <div className="col-12 text-center p-3 mt-5 mb-5 mr-5">
              <button
                type="button"
                className="btn btn-primary font-weight-bold btn-sm  shadow rounded"
                data-toggle="modal"
                data-target={"#profiletModel"}
              >
                <FontAwesomeIcon icon="edit" /> Edit Profile
              </button>
              <Link
                to="/"
                className="btn btn-light font-weight-bold ml-5 btn-sm  shadow rounded"
              >
                <FontAwesomeIcon icon="edit" /> Go Home
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="col-sm-12 col-md-10 col-lg-10 col-xl-10"></div>
    </div>
  );
};

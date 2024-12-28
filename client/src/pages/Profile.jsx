import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ConfirmDelete from "../components/ConfirmDelete";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsSuccess, setShowListingsSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteListing, setDeleteListing] = useState(false);
  const [listingId, setListingId] = useState(null);
  const [listingName, setListingName] = useState(null);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [showListingMessage, setShowListingMessage] = useState(false);

  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    const timer = setTimeout(() => {
      // showUpdateMessage(false);
      showListingMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [userListings]);

  const handleOpenDeleteListingConfirm = (id, name) => {
    setListingId(id);
    setListingName(name);
    setDeleteListing(true);
    setShowConfirmDelete(true);
  };

  const handleOpenDeleteUserConfirm = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDeleteListing = () => {
    handleListingDelete(listingId);
    setDeleteListing(false);
    setShowConfirmDelete(false);
    setListingId(null);
    setListingName(null);
  };

  const handleConfirmDeleteUser = () => {
    handleUserDelete();
    setShowConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setDeleteListing(false);
    setShowConfirmDelete(false);
    setListingId(null);
    setListingName(null);
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUserDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setShowUpdateMessage(true);
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) { 
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingMessage(true);
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      console.log(data.success);

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
      setShowListingsSuccess(true);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const myListings = userListings && userListings.length > 0;

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <p
          id="email"
          className="border p-3 rounded-lg bg-slate-100 text-gray-700"
        >
          {currentUser.email}
        </p>

        <input
          type="password"
          placeholder="currentPassword"
          onChange={handleChange}
          id="currentPassword"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="newPassword"
          onChange={handleChange}
          id="newPassword"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <button
          onClick={handleOpenDeleteUserConfirm}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:opacity-90"
        >
          Delete account
        </button>
        <button
          onClick={handleSignOut}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:opacity-90"
        >
          Sign out
        </button>
      </div>

      {showUpdateMessage && (
        <p className="text-red-700 mt-5">{error && error}</p>
      )}
      {showUpdateMessage && (
        <p className="text-green-700 mt-5">
          {updateSuccess && "User is updated successfully!"}
        </p>
      )}

      <div className="flex gap-2">
        <Link
          className="w-1/2 bg-cyan-600 text-white p-3 rounded-lg uppercase text-center hover:opacity-90"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
        <button
          onClick={handleShowListings}
          className="w-1/2 bg-teal-600 text-white px-1 py-2 rounded-md hover:opacity-90"
        >
          Check My Listings
        </button>
      </div>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {myListings && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold bg-rose-600 text-white px-2 py-1 rounded-md hover:opacity-95 ">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex item-center gap-1">
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:opacity-90 ">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() =>
                    handleOpenDeleteListingConfirm(listing._id, listing.name)
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showConfirmDelete && (
        <ConfirmDelete
          message={
            deleteListing
              ? `Are you sure you want to delete ${listingName}`
              : `Delete the account for ${currentUser.username}? All user data will be permanently removed.
`
          }
          onConfirm={
            deleteListing ? handleConfirmDeleteListing : handleConfirmDeleteUser
          }
          onCancel={handleCancelDelete}
        />
      )}
      {showListingMessage && showListingsSuccess && !myListings && (
        <p className="text-red-700 p-4">Oops! No listings found</p>
      )}
    </div>
  );
}

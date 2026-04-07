import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FaArrowRightLong,
  FaArrowTrendUp,
  FaCamera,
  FaChartColumn,
  FaHouse,
  FaLocationDot,
  FaPenToSquare,
  FaRegTrashCan,
  FaShieldHeart,
  FaUserGear,
} from 'react-icons/fa6';
import ConfirmDelete from '../components/ConfirmDelete';
import { uploadImage } from '../utils/upload';

const fieldClassName =
  'w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100';

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

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (!showListingMessage) return undefined;

    const timer = setTimeout(() => {
      setShowListingMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showListingMessage, userListings]);

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

  const handleFileUpload = async (selectedFile) => {
    try {
      setFileUploadError(false);
      setFilePerc(0);
      const avatarUrl = await uploadImage(selectedFile, setFilePerc);
      setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
    } catch (uploadError) {
      setFileUploadError(true);
      setFilePerc(0);
    }
  };

  const handleChange = (e) => {
    setUpdateSuccess(false);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUserDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (deleteError) {
      dispatch(deleteUserFailure(deleteError.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess());
    } catch (signOutError) {
      dispatch(signOutUserFailure(signOutError.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setShowUpdateMessage(true);
      setUpdateSuccess(false);
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    } catch (submitError) {
      dispatch(updateUserFailure(submitError.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingMessage(true);
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
      setShowListingsSuccess(true);
    } catch (listingsError) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (selectedListingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${selectedListingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== selectedListingId)
      );
    } catch (deleteError) {
      console.log(deleteError.message);
    }
  };

  const myListings = userListings && userListings.length > 0;
  const avatarSrc = formData.avatar || currentUser.avatar;
  const listingCount = userListings.length;

  return (
    <main className='page-shell py-10'>
      <section className='grid gap-8 xl:grid-cols-[1.05fr_0.95fr]'>
        <div className='space-y-8'>
          <div className='overflow-hidden rounded-[36px] bg-stone-900 text-white shadow-[0_35px_90px_-45px_rgba(15,23,42,0.72)]'>
            <div className='bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.18),transparent_28%)] p-8 sm:p-10'>
              <div className='flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between'>
                <div className='max-w-2xl space-y-4'>
                  <span className='inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200'>
                    Account dashboard
                  </span>
                  <div>
                    <h1 className='font-display text-5xl leading-none sm:text-6xl'>
                      Welcome back, {currentUser.username}
                    </h1>
                    <p className='mt-4 max-w-xl text-sm leading-7 text-stone-200 sm:text-base'>
                      Update your profile, manage published homes, and keep your account looking as polished as your listings.
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-4 rounded-[28px] bg-white/10 p-4 backdrop-blur-sm'>
                  <div className='relative'>
                    <img
                      src={avatarSrc}
                      alt='profile'
                      className='h-24 w-24 rounded-[28px] object-cover ring-4 ring-white/10'
                    />
                    <button
                      type='button'
                      onClick={() => fileRef.current?.click()}
                      className='absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg transition hover:bg-emerald-400'
                    >
                      <FaCamera />
                    </button>
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-[0.22em] text-stone-300'>Primary account</p>
                    <p className='mt-2 text-xl font-semibold text-white'>{currentUser.email}</p>
                    <button
                      type='button'
                      onClick={() => fileRef.current?.click()}
                      className='mt-3 text-sm font-semibold text-emerald-200 transition hover:text-white'
                    >
                      Change avatar
                    </button>
                  </div>
                </div>
              </div>

              <div className='mt-8 grid gap-4 sm:grid-cols-3'>
                <div className='rounded-[28px] bg-white/10 p-5 backdrop-blur-sm'>
                  <FaHouse className='text-lg text-emerald-200' />
                  <p className='mt-4 text-3xl font-semibold text-white'>{listingCount}</p>
                  <p className='mt-2 text-sm text-stone-300'>Listings loaded in this session</p>
                </div>
                <div className='rounded-[28px] bg-white/10 p-5 backdrop-blur-sm'>
                  <FaChartColumn className='text-lg text-emerald-200' />
                  <p className='mt-4 text-3xl font-semibold text-white'>
                    {showListingsSuccess ? 'Live' : 'Ready'}
                  </p>
                  <p className='mt-2 text-sm text-stone-300'>Portfolio overview available on demand</p>
                </div>
                <div className='rounded-[28px] bg-white/10 p-5 backdrop-blur-sm'>
                  <FaShieldHeart className='text-lg text-emerald-200' />
                  <p className='mt-4 text-3xl font-semibold text-white'>Secure</p>
                  <p className='mt-2 text-sm text-stone-300'>JWT session and protected media upload flow</p>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-[34px] border border-white/70 bg-white/85 p-6 shadow-soft'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Portfolio actions</p>
                <h2 className='mt-2 text-3xl font-semibold text-stone-900'>Manage your inventory</h2>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Link
                  className='inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-stone-800'
                  to='/create-listing'
                >
                  Create listing
                  <FaArrowRightLong />
                </Link>
                <button
                  onClick={handleShowListings}
                  className='rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-stone-700 transition hover:border-stone-900 hover:text-stone-900'
                >
                  Refresh my listings
                </button>
              </div>
            </div>

            <div className='mt-5 flex flex-wrap gap-3'>
              <div className='rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600'>
                <span className='font-semibold text-stone-900'>{listingCount}</span> listings loaded
              </div>
              <div className='rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600'>
                <span className='font-semibold text-stone-900'>{currentUser.username}</span> is the visible publisher name
              </div>
            </div>

            {showListingsError && (
              <p className='mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700'>
                Error showing listings
              </p>
            )}
            {showListingMessage && showListingsSuccess && !myListings && (
              <p className='mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700'>
                No listings found yet. Publish your first property to start building your portfolio.
              </p>
            )}

            {myListings && (
              <div className='mt-6 grid gap-4'>
                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className='grid gap-4 rounded-[28px] border border-stone-200 bg-stone-50/70 p-4 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center'
                  >
                    <Link to={`/listing/${listing._id}`} className='overflow-hidden rounded-[22px]'>
                      <img
                        src={listing.imageUrls[0]}
                        alt='listing cover'
                        className='h-28 w-full object-cover sm:h-24'
                      />
                    </Link>

                    <div className='min-w-0'>
                      <div className='flex flex-wrap items-center gap-2'>
                        <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500'>
                          {listing.type === 'rent' ? 'For rent' : 'For sale'}
                        </span>
                        {listing.offer && (
                          <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'>
                            ${Number(listing.regularPrice - listing.discountPrice).toLocaleString('en-US')} off
                          </span>
                        )}
                      </div>
                      <Link
                        className='mt-3 block truncate text-xl font-semibold text-stone-900 transition hover:text-emerald-700'
                        to={`/listing/${listing._id}`}
                      >
                        {listing.name}
                      </Link>
                      <p className='mt-2 flex items-center gap-2 text-sm text-stone-500'>
                        <FaLocationDot className='text-emerald-700' />
                        <span className='truncate'>{listing.address}</span>
                      </p>
                      <div className='mt-3 flex flex-wrap gap-2 text-xs font-semibold text-stone-600'>
                        <span className='rounded-full bg-white px-3 py-2'>{listing.bedrooms} bed</span>
                        <span className='rounded-full bg-white px-3 py-2'>{listing.bathrooms} bath</span>
                        <span className='rounded-full bg-white px-3 py-2'>
                          ${Number(listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString('en-US')}
                          {listing.type === 'rent' ? ' / mo' : ''}
                        </span>
                      </div>
                    </div>

                    <div className='flex gap-2 sm:flex-col'>
                      <Link
                        to={`/update-listing/${listing._id}`}
                        className='inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-800'
                      >
                        <FaPenToSquare />
                        Edit
                      </Link>
                      <button
                        onClick={() =>
                          handleOpenDeleteListingConfirm(listing._id, listing.name)
                        }
                        className='inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-300 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-500 hover:bg-rose-50'
                      >
                        <FaRegTrashCan />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className='space-y-8'>
          <div className='rounded-[34px] border border-white/70 bg-white/88 p-6 shadow-soft'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700'>
                <FaUserGear />
              </div>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Profile settings</p>
                <h2 className='mt-1 text-3xl font-semibold text-stone-900'>Account details</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='mt-6 space-y-5'>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type='file'
                ref={fileRef}
                hidden
                accept='image/*'
              />

              <div className='rounded-[28px] bg-stone-50 p-5'>
                <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
                  <div className='relative w-fit'>
                    <img
                      onClick={() => fileRef.current?.click()}
                      src={avatarSrc}
                      alt='profile'
                      className='h-24 w-24 cursor-pointer rounded-[28px] object-cover ring-4 ring-white'
                    />
                    <button
                      type='button'
                      onClick={() => fileRef.current?.click()}
                      className='absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white transition hover:bg-stone-800'
                    >
                      <FaCamera />
                    </button>
                  </div>
                  <div className='space-y-2'>
                    <p className='text-lg font-semibold text-stone-900'>Profile photo</p>
                    <p className='text-sm leading-7 text-stone-500'>
                      Upload a clean square image for a more trustworthy account presence across the app.
                    </p>
                    <button
                      type='button'
                      onClick={() => fileRef.current?.click()}
                      className='text-sm font-semibold text-emerald-700 transition hover:text-emerald-800'
                    >
                      Choose new photo
                    </button>
                  </div>
                </div>

                <div className='mt-4'>
                  {fileUploadError ? (
                    <p className='rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700'>
                      Image upload failed. Please try a smaller or clearer image.
                    </p>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <p className='rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700'>
                      Uploading avatar: {filePerc}%
                    </p>
                  ) : filePerc === 100 ? (
                    <p className='rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700'>
                      Avatar uploaded successfully.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className='grid gap-5'>
                <div>
                  <label htmlFor='username' className='mb-2 block text-sm font-semibold text-stone-800'>
                    Username
                  </label>
                  <input
                    type='text'
                    placeholder='username'
                    defaultValue={currentUser.username}
                    id='username'
                    className={fieldClassName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className='mb-2 block text-sm font-semibold text-stone-800'>Email address</label>
                  <p className='rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600'>
                    {currentUser.email}
                  </p>
                </div>

                <div className='grid gap-5 sm:grid-cols-2'>
                  <div>
                    <label htmlFor='currentPassword' className='mb-2 block text-sm font-semibold text-stone-800'>
                      Current password
                    </label>
                    <input
                      type='password'
                      placeholder='Current password'
                      onChange={handleChange}
                      id='currentPassword'
                      className={fieldClassName}
                    />
                  </div>
                  <div>
                    <label htmlFor='newPassword' className='mb-2 block text-sm font-semibold text-stone-800'>
                      New password
                    </label>
                    <input
                      type='password'
                      placeholder='New password'
                      onChange={handleChange}
                      id='newPassword'
                      className={fieldClassName}
                    />
                  </div>
                </div>
              </div>

              {showUpdateMessage && error && (
                <p className='rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700'>{error}</p>
              )}
              {showUpdateMessage && updateSuccess && (
                <p className='rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700'>
                  Profile updated successfully.
                </p>
              )}

              <div className='flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row'>
                <button
                  disabled={loading}
                  className='inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  <FaArrowTrendUp />
                  {loading ? 'Saving...' : 'Update profile'}
                </button>
                <button
                  type='button'
                  onClick={handleSignOut}
                  className='rounded-2xl border border-amber-300 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-amber-700 transition hover:border-amber-500 hover:bg-amber-50'
                >
                  Sign out
                </button>
                <button
                  type='button'
                  onClick={handleOpenDeleteUserConfirm}
                  className='rounded-2xl border border-rose-300 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-rose-700 transition hover:border-rose-500 hover:bg-rose-50'
                >
                  Delete account
                </button>
              </div>
            </form>
          </div>

          <div className='rounded-[34px] border border-white/70 bg-white/88 p-6 shadow-soft'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Profile guidance</p>
            <div className='mt-5 space-y-4 text-sm leading-7 text-stone-600'>
              <div className='rounded-[24px] bg-stone-50 p-4'>
                <p className='font-semibold text-stone-900'>Use a recognizable avatar</p>
                <p className='mt-2'>A crisp profile image makes your listing presence feel more credible to buyers and renters.</p>
              </div>
              <div className='rounded-[24px] bg-stone-50 p-4'>
                <p className='font-semibold text-stone-900'>Keep your pricing current</p>
                <p className='mt-2'>Refreshing listings regularly helps the home cards and search results stay aligned with real inventory.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showConfirmDelete && (
        <ConfirmDelete
          message={
            deleteListing
              ? `Are you sure you want to delete ${listingName}?`
              : `Delete the account for ${currentUser.username}? All user data will be permanently removed.`
          }
          onConfirm={
            deleteListing ? handleConfirmDeleteListing : handleConfirmDeleteUser
          }
          onCancel={handleCancelDelete}
        />
      )}
    </main>
  );
}

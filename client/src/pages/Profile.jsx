import { useRef, useState } from "react";
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect } from "react";
import { app } from "../firebase";
import { Link } from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure
} from "../redux/user/userSlice"
import { useDispatch } from "react-redux";
import { FaEdit } from 'react-icons/fa'
import ListCard from "../components/ListingCard";
const Profile = () => {
  const { currentUser, loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [progressPerc, setProgressPerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [edit, setEdit] = useState(false);
  const [profileUpdate, setProfileUpdate] = useState(0);
  const [formData, setFormData] = useState({});
  const [userListings, setUserListings] = useState([]);
  const [userListingRequested,setUserListingRequested] = useState(false);
  const [showListingsError,setShowListingsError] = useState(false);
  const [loadingListings,setLoadingListings] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file])
  useEffect(() => {
    setProfileUpdate(0);
  }, [])
  const handleFileUpload = () => {
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgressPerc(Math.round(progress));
    },
      (error) => {
        setFileUploadError(true);
      }
      ,
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
        }).catch((error) => {
          setFileUploadError(true);
        })
      }
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setProfileUpdate(-1);
        return;
      }
      dispatch(updateUserSuccess(data.others));
      setProfileUpdate(1);
      setEdit(false);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setProfileUpdate(-1);
    }
  }
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess());
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
      setProfileUpdate(-1);
    }
  }
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success === false) {
        console.log("error in signout");
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      setLoadingListings(true);
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      console.log(data.lists);
      setLoadingListings(false);
      if (data.success === false) {
        setShowListingsError(true);
        console.log("error in getting listings");
        return;
      }
      setUserListings(data.lists);
      setUserListingRequested(true);
      console.log(data.lists);
    }catch(error){
      setLoadingListings(false);
      setShowListingsError(true);
    }
  }
  const handleDeleteListing = async (id) => {
    try {
      setLoadingListings(true);
      setShowListingsError(false);
      const res = await fetch(`/api/list/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setLoadingListings(false);
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings((prev) => prev.filter((item) => item._id !== id));
    }catch(error){
      setLoadingListings(false);
      setShowListingsError(true);
    }
  }

  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit}

        className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file" hidden ref={fileRef} accept="image/*" />
        <img src={formData.avatar || currentUser.avatar} alt="profile_image"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center hover:opacity-80"
          onClick={() => fileRef.current.click()}
        />
        <span onClick={() => setEdit(!edit)} className="text-slate-700 hover:text-red-500 cursor-pointer self-end"><FaEdit /></span>
        {
          fileUploadError ? (<p className="text-red-500 mx-auto">Error in uploading</p>) :
            progressPerc > 0 && progressPerc < 100 ? (<p className="text-slate-700 max-auto">File uploadding... {progressPerc}%</p>) : progressPerc === 100 ? (<p className="text-green-500 mx-auto">File uploaded successfully</p>) : ""
        }
        <input type="text" placeholder="name" id="name" defaultValue={currentUser.username} onChange={handleChange} disabled={!edit} className={`${edit && "bg-slate-900 border text-white"} p-3 rounded-lg`} />
        <input type="text" placeholder="email" id="email" defaultValue={currentUser.email} onChange={handleChange} disabled={!edit} className={`${edit && "bg-slate-900 border text-white"} p-3 rounded-lg`} />
        <input type="password" placeholder="password" id="password" onChange={handleChange} disabled={!edit} className={`${edit && "bg-slate-900 border text-white"} p-3 rounded-lg`} />
        <button type="submit" disabled={loading} className={`${edit ? "bg-red-700" : "bg-slate-700"} text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80`}>Update</button>
        {
          loading ? (
            <p className="text-slate-500 mx-auto">Updating...</p>
          ) : profileUpdate === -1 ? (
            <p className="text-red-500 mx-auto italic">Error:{" " + error}</p>
          ) : profileUpdate === 1 ? (
            <p className="text-green-500 mx-auto">Updated Successful</p>
          ) : null
        }
        <Link className="bg-green-700 text-white p-3 rounded-lg hover:opacity-95 text-center" to="/create-listing" >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-500 cursor-pointer" onClick={handleDelete}>Delete Account</span>
        <span onClick={handleSignOut} className="text-red-500 cursor-pointer">Sign Out</span>
      </div>
      <button type="button" className = "w-full font-semibold text-lg bg-white-700 text-green-500 p-3 rounded-lg hover:opacity-95 text-center" onClick={handleShowListings}>Show Listings</button>
      <p className="text-red-500 mt-5 italic">{showListingsError ? "Error in fetching listings" : ""}</p>
      {
        loadingListings && (
          <div className="flex justify-center">
            <ClipLoader size={50} color="red" />
          </div>
        )
      }
      {
        !loadingListings && userListings.length > 0 && userListingRequested ? (
          userListings.map((list) => (
            <Link key={list._id} to={`/listing/${list._id}`}> 
            <ListCard  listData={list} handleDeleteListing={handleDeleteListing} />
            </Link>
          ))
        ) :!userListingRequested?null: <p className="text-red-500 mt-5 italic">No listings found</p>
      }
    </div>

  )
}

export default Profile
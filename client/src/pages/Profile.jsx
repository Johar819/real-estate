import { useRef, useState } from "react";
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect } from "react";
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice"
import { useDispatch } from "react-redux";
import {FaEdit} from 'react-icons/fa'
const Profile = () => {
  const { currentUser, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [progressPerc, setProgressPerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [edit, setEdit] = useState(false);
  const [profileUpdate, setProfileUpdate] = useState(0);
  const [formData, setFormData] = useState({});
  useEffect(() => {
    setProfileUpdate(0);
  },[])
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file])
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
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setProfileUpdate(-1);
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
          <span onClick={() => setEdit(!edit)} className="text-slate-700 hover:text-red-500 cursor-pointer self-end"><FaEdit/></span>
        {
          fileUploadError ? (<p className="text-red-500 mx-auto">Error in uploading</p>) :
            progressPerc > 0 && progressPerc < 100 ? (<p className="text-slate-700 max-auto">File uploadding... {progressPerc}%</p>) : progressPerc === 100 ? (<p className="text-green-500 mx-auto">File uploaded successfully</p>) : ""
        }
        <input type="text" placeholder="name" id="name" defaultValue={currentUser.username} onChange={handleChange} disabled={!edit} className={`${edit && "bg-slate-900 border text-white"} p-3 rounded-lg`} />
        <input type="text" placeholder="email" id="email" defaultValue={currentUser.email} onChange={handleChange} disabled={!edit} className={`${edit && "bg-slate-900 border text-white"} p-3 rounded-lg` } />
        <input type="password" placeholder="password" id="password" onChange={handleChange} disabled={!edit} className={`${edit && "bg-slate-900 border text-white"} p-3 rounded-lg`} />
        <button type="submit" disabled={loading} className={`${edit? "bg-red-700":"bg-slate-700"} text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80`}>Update</button>
        {
          loading?(
            <p className="text-green-500 mx-auto">Updating...</p>
          ):profileUpdate===1?(
            <p className="text-green-500 mx-auto">Profile Updated</p>
          ):profileUpdate===-1?(
            <p className="text-red-500 mx-auto">Update Failed</p>
          ):null
        }
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-500">Delete Account</span>
        <span className="text-red-500">Sign Out</span>
      </div>
    </div>

  )
}

export default Profile
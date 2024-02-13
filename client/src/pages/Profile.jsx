import { useRef, useState } from "react";
import { useSelector } from "react-redux"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect } from "react";
import { app } from "../firebase";
const Profile = () => {
  const { currentUser } = useSelector(state => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [progressPerc, setProgressPerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    img: currentUser.others.avatar
  });
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
      console.log('Upload is ' + progress + '% done');
      setProgressPerc(Math.round(progress));
    },
      (error) => {
        setFileUploadError(true);
      }
      ,
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, img: downloadURL }));
        }).catch((error) => {
          setFileUploadError(true);
        })
      }
    );
  }
  return (
    <div className=" p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file" hidden ref={fileRef} accept="image/*" />
        <img src={`${formData.img}`} alt="profile_image"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center hover:opacity-80"
          onClick={() => fileRef.current.click()}
        />
        {
          fileUploadError ? (<p className="text-red-500 mx-auto">Error in uploading</p>) :
            progressPerc > 0 && progressPerc < 100 ? (<p className="text-slate-700 max-auto">File uploadding... {progressPerc}%</p>) : progressPerc === 100 ? (<p className="text-green-500 mx-auto">File uploaded successfully</p>) : ""
        }
        <input type="text" placeholder="name" id="name" className="border p-3 rounded-lg " />
        <input type="text" placeholder="email" id="email" className="border p-3 rounded-lg " />
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg " />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-500">Delete Account</span>
        <span className="text-red-500">Sign Out</span>
      </div>
    </div>

  )
}

export default Profile
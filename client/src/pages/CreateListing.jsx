import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
const CreateListing = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [file, setFile] = useState([]);
    const [listingError, setListingError] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'rent',
        description: '',
        address: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        price: 0,
        regularPrice: 0,
        discountPrice: 0,
        offer: false,
        imageUrls: [],
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData((prev) => ({ ...prev, type: e.target.id }));
        }
        if (e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished') {
            setFormData((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData((prev) => ({ ...prev, [e.target.id]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));
        }
    }
    const handleImageSubmit = () => {
        if (file.length > 0 && file.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            setIsUploaded(false);
            const promises = [];
            for (let i = 0; i < file.length; i++) {
                promises.push(storeImage(file[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData((prev) => ({ ...prev, imageUrls: formData.imageUrls.concat(urls) }));
                setUploading(false);
                setIsUploaded(true);
            }).catch((error) => {
                setImageUploadError("An error occured while uploading images.Maximum size is 2 MB");
                setUploading(false);
                setIsUploaded(false);
            })
        } else if (file.length + formData.imageUrls.length > 6) {
            setImageUploadError("You can upload maximum 6 images per listing");
            setIsUploaded(false);
        } else {
            setImageUploadError("No image is selected");
            setIsUploaded(false);
        }
    }
    const storeImage = async (imageFile) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + imageFile.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        })
    }
    const handleRemoveImage = (index) => {
        setFormData((prev) => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isUploaded === false) {
                setListingError('Please upload images.\nSelect images and then click on UPLOAD button to upload images.');
                return;
            }
            if (formData.regularPrice < formData.discountPrice) {
                setListingError('Discounted price should be less than regular price');
                return;
            }
            setLoading(true);
            setListingError(false);
            const res = await fetch('/api/list/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...formData, userRef: currentUser._id })
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setLoading(false);
                setListingError(data.message);
                return;
            }
            navigate(`/listing/${data.list._id}`);
        } catch (error) {
            setLoading(false);
            setListingError(error.message);
        }
    }
    return (
        <main className="max-w-4xl mx-auto p-3">
            <h1 className="text-3xl font-semibold text-center my-7">Create a listing</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-0 sm:flex-row sm:gap-12">
                <div className="flex flex-col gap-2 flex-1 ">
                    <input onChange={handleChange} value={formData.name} required type="text" placeholder="Name" className="input input-bordered w-full rounded h-[50px] border 1 px-1" id="name" maxLength={60} />
                    <textarea onChange={handleChange} value={formData.description} required type="text" placeholder="Description" className="input input-bordered w-full h-[100px] border 1 px-1 rounded " id="description" maxLength={120} />
                    <input onChange={handleChange} value={formData.address} required type="text" placeholder="Address" className="input input-bordered w-full rounded h-[50px] border 1 px-1" id="address" />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={formData.type === 'sale'} type="checkbox" name="Sale" id="sale" className="w-5" />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={formData.type === 'rent'} type="checkbox" name="Rent" id="rent" className="w-5" />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={formData.parking} type="checkbox" name="Parking" id="parking" className="w-5" />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={formData.furnished} type="checkbox" name="Furnished" id="furnished" className="w-5" />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={formData.offer} type="checkbox" name="Offer" id="offer" className="w-5" />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange} value={formData.bedrooms} type="number" name="Bedrooms" id="bedrooms" min={1} max={10} required className="p-3 border border-gray-400 rounded-lg" />
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange} value={formData.bathrooms} type="number" name="Bathrooms" id="bathrooms" min={1} max={10} required className="p-3 border border-gray-400 rounded-lg" />
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange} value={formData.regularPrice} type="number" name="RegularPrice" id="regularPrice" min={1} max={5000000} required className="p-3 border border-gray-400 rounded-lg" />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-[12px]">(<span>&#8377;</span>
                                    / Month)</span>
                            </div>
                        </div>
                        {
                            formData.offer &&
                            (
                            <div className="flex items-center gap-2">
                                <input onChange={handleChange} value={formData.discountPrice} type="number" name="DiscountPrice " id="discountPrice" min={1} max={5000000} required className="p-3 border border-gray-400 rounded-lg" />
                                <div className="flex flex-col items-center">
                                    <p>Discount Price</p>
                                    <span className="text-[12px]">(<span>&#8377;</span> / Month)</span>
                                </div>
                            </div>
                            )
                        }
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-3">
                    <p className="font-semibold">Images:
                        <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
                    </p>
                    <div className="flex gap-1">
                        <input onChange={(e) => setFile(e.target.files)} type="file" name="images" id="images" accept="images/*" multiple className="p-2 border border-gray-300" />
                        <button type="button" disabled={uploading} onClick={handleImageSubmit} className="text-green-700  bg-white px-4 py-2 border uppercase border-green-400 rounded hover:shadow-lg disabled:80">{uploading ? "Uploading..." : "Upload"}</button>
                    </div>
                    <p className="text-red-700 italic">{imageUploadError && "Error : " + imageUploadError}</p>

                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className="flex justify-between items-center border border-gray-300 mb-1 p-1 rounded-lg">
                                <img src={url} alt="image" className="w-[100px] h-auto object-cover mb-1 rounded-lg" />
                                <button className="p-2 bg-white-700 text-red-700 font-semibold rounded-lg uppercase hover:bg-red-700 hover:text-white hover:opacity-95 disabled:80" onClick={() => handleRemoveImage(index)}>Remove</button>
                            </div>)
                        )
                    }
                    <button disabled={loading || !isUploaded} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:80">Create Listing</button>
                    {
                        loading ? <p className="text-slate-700 italic max-auto">Loading...</p> : listingError ? <p className="text-red-700 italic max-auto">{listingError}</p> : listingError === 0 ? null : <p className="text-green-700 italic self-center">Listing created!</p>
                    }
                </div>
            </form>
        </main>
    )
}

export default CreateListing
const CreateListing = () => {
    return (
        <main className="max-w-4xl mx-auto p-3">
            <h1 className="text-3xl font-semibold text-center my-7">Create a listing</h1>
            <form className="flex flex-col gap-0 sm:flex-row sm:gap-12">
                <div className="flex flex-col gap-2 flex-1 ">
                    <input type="text" placeholder="Name" className="input input-bordered w-full rounded h-[50px] border 1 px-1" id="name" maxLength={60} />
                    <textarea type="text" placeholder="Description" className="input input-bordered w-full h-[100px] border 1 px-1 rounded " id="description" maxLength={120} />
                    <input type="text" placeholder="Address" className="input input-bordered w-full rounded h-[50px] border 1 px-1" id="address" />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" name="Sale" id="sale" className="w-5" />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" name="Rent" id="rent" className="w-5" />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" name="Parking" id="parking" className="w-5" />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" name="Furnished" id="furnished" className="w-5" />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" name="Offer" id="offer" className="w-5" />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <input type="number" name="Bedrooms" id="bedrooms" min={1} max={10} required className="p-3 border border-gray-400 rounded-lg" />
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" name="Bathrooms" id="bathrooms" min={1} max={10} required className="p-3 border border-gray-400 rounded-lg" />
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" name="RegularPrice" id="regularPrice" min={1} max={10} required className="p-3 border border-gray-400 rounded-lg" />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-[12px]">($ / Month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="number" name="DiscountPrice " id="discountPrice" min={1} max={10} required className="p-3 border border-gray-400 rounded-lg" />
                            <div className="flex flex-col items-center">
                                <p>Discount Price</p>
                                <span className="text-[12px]">($ / Month)</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-3">
                    <p className="font-semibold">Images:
                    <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
                    </p>
                <div className="flex gap-1">
                    <input type="file" name="images" id="images" accept="images/*" multiple  className="p-2 border border-gray-300"/>
                    <button className="text-green-700  bg-white px-4 py-2 border uppercase border-green-400 rounded hover:shadow-lg disabled:80">Upload</button>
                </div>
                <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:80">Create Listing</button>
                </div>
            </form>
        </main>
    )
}

export default CreateListing
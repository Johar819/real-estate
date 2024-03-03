const Search = () => {
    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-5 border-b-2 md:border-r-2 md:border-b-0 md:min-h-screen w-screen md:w-[25%]  ">
                <form action="" className="flex flex-col gap-7">
                    <div className="flex items-center gap-2">
                        <label htmlFor="searchTerm" className="font-semibold">Search</label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            className="border rounded-lg p-3 w-full"

                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 ">
                        <label htmlFor="type" className="font-semibold">
                            Type:
                        </label>
                        <div className="flex flex-row items-center gap-1">
                            <input
                                type="checkbox"
                                id="all"
                                className="w-5"
                            />
                            <label htmlFor="all">Rent & Sale</label>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                            />
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                            />
                            <label htmlFor="sale">Sale</label>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                            />
                            <label htmlFor="offer">Offer</label>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 ">
                        <label htmlFor="amenities" className="font-semibold">
                            Amenities:
                        </label>
                        <div className="flex flex-row items-center gap-1">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                            />
                            <label htmlFor="all">Parking</label>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                            />
                            <label htmlFor="furnished">Furnished</label>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort_order" className="font-semibold">Sort:</label>
                        <select id='sort_order'
                        className="border rounded-lg p-1">
                            <option>Price low to high</option>
                            <option>Price high to low</option>
                            <option>Latest</option>
                            <option>Oldest</option>
                        </select>
                    </div>
                    <button className="p-3 bg-slate-700 text-white rounded-lg w-full hover:opacity-95 uppercase">Search</button>
                </form>
            </div>
            <div><h1 className="p-3 font-semibold text-3xl text-slate-700 border-b mt-3">Listing Results:</h1></div>
        </div>
    )
}

export default Search
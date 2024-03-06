import { useEffect } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ListingItem from "../components/ListingItem";

const Search = () => {
    const [searchBarData, setSearchBarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',

    });
    const [prevDisable, setPrevDisable] = useState(true);
    const [nextDisable, setNextDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchBarData((prev) => ({ ...prev, searchTerm: searchTermFromUrl }));
        }
        const typeFromUrl = urlParams.get('type');
        if (typeFromUrl) {
            setSearchBarData((prev) => ({ ...prev, type: typeFromUrl || 'all' }));
        }
        const parkingFromUrl = urlParams.get('parking');
        if (parkingFromUrl) {
            setSearchBarData((prev) => ({ ...prev, parking: parkingFromUrl === 'true' ? true : false }));
        }
        const furnishedFromUrl = urlParams.get('furnished');
        if (furnishedFromUrl) {
            setSearchBarData((prev) => ({ ...prev, furnished: furnishedFromUrl === 'true' ? true : false }));
        }
        const offerFromUrl = urlParams.get('offer');
        if (offerFromUrl) {
            setSearchBarData((prev) => ({ ...prev, offer: offerFromUrl === 'true' ? true : false }));
        }
        const sortFromUrl = urlParams.get('sort');
        if (sortFromUrl) {
            setSearchBarData((prev) => ({ ...prev, sort: sortFromUrl || 'created_at' }));
        }
        const orderFromUrl = urlParams.get('order');
        if (orderFromUrl) {
            setSearchBarData((prev) => ({ ...prev, order: orderFromUrl || 'desc' }));
        }
        if(urlParams.get('startIndex')==='0' || urlParams.get('startIndex')===null){
            setPrevDisable(true);
        }else if(Number(urlParams.get('startIndex')) > 2){
            setPrevDisable(false);
        }

        //fetching data
        const fectchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            try {
                const res = await fetch(`api/list/get?${searchQuery}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                const data = await res.json();
                setLoading(false);
                // console.log("listings", data.lists);
                if (data.success === false) {
                    console.log(data.message);
                    return;
                }
                const startPostion = Number(urlParams.get('startIndex'))?Number(urlParams.get('startIndex')):0;
                if(data.count === data.lists.length+startPostion){
                    setNextDisable(true);
                }else setNextDisable(false);
                setListings(data.lists);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        fectchListings();
    }, [location.search])
    const navigate = useNavigate();
    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSearchBarData((prev) => ({ ...prev, type: e.target.id }));
        }
        if (e.target.id === 'searchTerm') {
            setSearchBarData((prev) => ({ ...prev, searchTerm: e.target.value }));
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSearchBarData((prev) => ({ ...prev, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false }));
        }
        if (e.target.id === 'sort_order') {
            setSearchBarData((prev) => ({ ...prev, sort: e.target.value.split('_')[0] || 'created_at', order: e.target.value.split('_')[1] || 'desc' }));
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchBarData.searchTerm);
        urlParams.set('type', searchBarData.type);
        urlParams.set('parking', searchBarData.parking);
        urlParams.set('furnished', searchBarData.furnished);
        urlParams.set('offer', searchBarData.offer);
        urlParams.set('sort', searchBarData.sort);
        urlParams.set('order', searchBarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    const handlePagination = async (flag) => {
        setLoading(true);
        const urlParams = new URLSearchParams(window.location.search);
        if (flag) urlParams.set('startIndex', urlParams.get('startIndex') ? Number(urlParams.get('startIndex')) + 9 : 9);
        else urlParams.set('startIndex', urlParams.get('startIndex') ? Number(urlParams.get('startIndex')) - 9 : 0);
        const searchQuery = urlParams.toString();
        try {
            const res = await fetch(`api/list/get?${searchQuery}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            // setListings(data.lists);
            navigate(`/search?${searchQuery}`);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-10">
            <div className="p-5 border-b-2 md:border-r-2 md:border-b-0 md:min-h-screen w-screen md:w-[300px]  ">
                <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                    <div className="flex items-center gap-2">
                        <label htmlFor="searchTerm" className="font-semibold">Search</label>
                        <input
                            type="text"
                            id="searchTerm"
                            placeholder="Search..."
                            className="border rounded-lg p-3 w-full"
                            onChange={handleChange}
                            value={searchBarData.searchTerm}

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
                                onChange={handleChange}
                                checked={searchBarData.type === 'all'}
                            />
                            <label htmlFor="all">Rent & Sale</label>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                onChange={handleChange}
                                checked={searchBarData.type === 'rent'}
                            />
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                onChange={handleChange}
                                checked={searchBarData.type === 'sale'}
                            />
                            <label htmlFor="sale">Sale</label>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                onChange={handleChange}
                                checked={searchBarData.offer}
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
                                onChange={handleChange}
                                checked={searchBarData.parking}
                            />
                            <label htmlFor="parking">Parking</label>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                onChange={handleChange}
                                checked={searchBarData.furnished}
                            />
                            <label htmlFor="furnished">Furnished</label>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <label htmlFor="sort_order" className="font-semibold">Sort:</label>
                        <select
                            id='sort_order'
                            className="border rounded-lg p-1"
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            value={searchBarData.sort + '_' + searchBarData.order}
                        >
                            <option value={'regularPrice_asc'}>Price low to high</option>
                            <option value={'regularPrice_desc'}>Price high to low</option>
                            <option value={'createdAt_desc'}>Latest</option>
                            <option value={'created_asc'}>Oldest</option>
                        </select>
                    </div>
                    <button className="p-3 bg-slate-700 text-white rounded-lg w-full hover:opacity-95 uppercase">Search</button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className="p-3 font-semibold text-3xl text-slate-700 border-b mt-3">Listing Results:</h1>
                <div className="flex flex-wrap gap-2">
                    {
                        !loading && listings.length === 0 && (<p className="text-xl text-slate-700"> No Listings Found </p>)
                    }
                    {
                        loading && (<p className="text-xl text-slate-700 w-full text-center"> Loading... </p>)
                    }
                    {
                        !loading && listings && listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))
                    }
                </div>
                    {
                        !loading && listings && (
                            <div className="flex justify-center gap-5 font-bold">
                                <button
                                    className={`${prevDisable ? 'text-gray-400' : 'text-gray-800'}`} 
                                    onClick={()=>handlePagination(false)} disabled = {prevDisable} type="button">Prev</button>
                                <button
                                    className={`${nextDisable ? 'text-gray-400' : 'text-gray-800'}`} 
                                    onClick={()=>handlePagination(true)} disabled = {nextDisable} type="button">Next</button>
                            </div>
                        )
                    }
            </div>
        </div>
    )
}

export default Search
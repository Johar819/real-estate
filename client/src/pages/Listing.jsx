import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ClipLoader from 'react-spinners/ClipLoader'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
const Listing = () => {
    SwiperCore.use([Navigation]);
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    console.log("list", listing);
    console.log("Error", error);
    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await fetch(`/api/list/get/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const data = await res.json();
                setLoading(false);
                if (data.success === false) {
                    setError('Something went wrong!');
                    return;
                }
                setListing(data.list);
            } catch (error) {
                setLoading(false);
                setError("Something went wrong!");
            }
        }
        fetchListings();


    }, [])

    return (
        <main>
            {loading && <div className="text-red-500 w-full h-screen flex items-center justify-center"><ClipLoader color="red" size={50} /></div>}
            {error && <div className="text-red-500">{error}</div>}
            {listing && !loading && !error &&
                <div>
                    <Swiper navigation>
                        {
                            listing.imageURLs.map((url) =>
                            (
                                <SwiperSlide key={url}>
                                    <div
                                        className="h-[500px]"
                                        style={{
                                            background: `url(${url}) center no-repeat`,
                                            backgroundSize: 'cover'
                                        }}
                                    >
                                    </div>
                                </SwiperSlide>
                            )
                            )
                        }
                    </Swiper>
                </div>


            }
        </main>
    )
}

export default Listing
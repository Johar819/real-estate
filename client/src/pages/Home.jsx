import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import 'swiper/css/autoplay';
import ListingItem from '../components/ListingItem';

const Home = () => {
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  SwiperCore.use([Navigation, Autoplay]);
  console.log("offer", offerListing);
  console.log("rent", rentListing);
  console.log("sale", saleListing);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch('/api/list/get?offer=true&limit=4',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        const data = await response.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setOfferListing(data.lists);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListings = async () => {
      try {
        const response = await fetch('/api/list/get?type=rent&limit=4',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        const data = await response.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setRentListing(data.lists);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSaleListings = async () => {
      try {
        const response = await fetch('/api/list/get?type=sale&limit=4',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
        const data = await response.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setSaleListing(data.lists);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings();
  }, [])
  return (
    <div>

      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Johar Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>
      {/* swiper */}

      <Swiper navigation autoplay={true}>
        {
          offerListing && offerListing.length > 0 &&
          offerListing.map((listing) => {
            return (
              <SwiperSlide key={listing._id}
              >
                <div style={{ backgroundImage: `url(${listing.imageURLs[0]})`, backgroundSize: 'cover' }}
                  className='h-[500px]'
                >
                </div>
              </SwiperSlide>
            )
          })
        }
      </Swiper>
      {/* listing results */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListing && offerListing.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
              {rentListing && rentListing.length > 0 && (
                <div className=''>
                  <div className='my-3'>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
                  </div>
                  <div className='flex flex-wrap gap-4'>
                    {rentListing.map((listing) => (
                      <ListingItem listing={listing} key={listing._id} />
                    ))}
                  </div>
                </div>
              )}
              {saleListing && saleListing.length > 0 && (
                <div className=''>
                  <div className='my-3'>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                    <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
                  </div>
                  <div className='flex flex-wrap gap-4'>
                    {saleListing.map((listing) => (
                      <ListingItem listing={listing} key={listing._id} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
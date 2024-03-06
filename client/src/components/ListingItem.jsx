import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { MdLocationOn } from 'react-icons/md'
const ListingItem = ({ listing }) => {
    const { _id, name, imageURLs, description, address } = listing;
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg w-full sm:w-[320px] mb-2">
            <Link to={`/listing/${_id}`}>
                <img src={imageURLs[0]} alt={name} className="w-full h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300" />
                <div className="p-3 flex flex-col gap-2 w-full">
                    <p className="truncate font-semibold text-lg text-slate-700">{name}</p>
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-700" />
                        <p className="text-sm text-gray-700 truncate w-full">{address}</p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
                    <p className="text-slate-500 mt-2 font-semibold">
                        <span className="mr-1">&#8377;</span>
                        {
                            listing.offer ? listing.discountPrice.toLocaleString('en-IN')
                                : listing.regularPrice.toLocaleString('en-IN')
                        }
                        {
                            listing.type === 'rent' && '/month'
                        }
                    </p>
                    <div className="flex gap-2 text-slate-700">
                        <div className='font-bold text-xs'>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}</div>
                        <div className='font-bold text-xs'>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : '1 Bath'}</div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

ListingItem.propTypes = {
    listing: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        imageURLs: PropTypes.arrayOf(PropTypes.string).isRequired,
        description: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        regularPrice: PropTypes.number.isRequired,
        offer: PropTypes.boolean,
        discountPrice: PropTypes.number,
        type: PropTypes.string.isRequired,
        bedrooms: PropTypes.number.isRequired,
        bathrooms: PropTypes.number.isRequired
    }).isRequired
};

export default ListingItem
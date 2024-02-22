import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
const ListCard = ({ listData, handleDeleteListing }) => {
    ListCard.propTypes = {
        listData: PropTypes.object.isRequired,
        handleDeleteListing: PropTypes.func.isRequired,
    };
    const handleDelete = () => {
        handleDeleteListing(listData._id);
    }
    
    return (
        <div className="flex flex-col mx-auto mb-5">
            <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                    <img src={listData.imageURLs[0]} alt={'Cover'} className="w-20 h-20 rounded-lg" />
                    <p className="font-semibold" >{listData.name}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <button className="text-red-500 uppercase" onClick={handleDelete}>Delete</button>
                    <Link to={`/update-listing/${listData._id}`}>
                    <button className='text-green-500 upppercase'>Edit</button>
                    </Link>
                </div>
        </div>
        </div>
    );
};

export default ListCard;
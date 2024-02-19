import PropTypes from 'prop-types';
const ListCard = ({ listData, handleDeleteListing, handleEditListing }) => {
    ListCard.propTypes = {
        listData: PropTypes.object.isRequired,
        handleDeleteListing: PropTypes.func.isRequired,
        handleEditListing: PropTypes.func.isRequired,
    };
    const handleDelete = () => {
        handleDeleteListing(listData._id);
    }
    const handleEdit = () => {
        handleEditListing(listData._id);
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
                    <button className='text-green-500 upppercase' onClick={handleEdit}>Edit</button>
                </div>
        </div>
        </div>
    );
};

export default ListCard;
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const handleChannge = (e) => {
    setMessage(e.target.value);
  }
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`/api/user/${listing.userRef}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();

        if (data.success === false) {
          console.log(data.message);
        }
        setLandlord(data.rest);
      } catch (error) {
        console.log(error);
      }
    }
    fetchLandlord();
  }, [listing.userRef])
  return (
    <>
      {
        landlord && (

          <div className='flex flex-col gap-2'>
            <p>Conatact<span className='font-semibold m-2'>{landlord.username}</span>
             for <span className='font-semibold lowercase'>{listing.name}</span>
            </p>
            <textarea
              onChange={handleChannge}
              name="message"
              id="message"
              value={message}
              rows="2"
              placeholder='Enter You Message Here...'
              className='w-full border border-gray-400 p-3 rounded-none'>
            </textarea>
            <Link to={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
              className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
            >
                    Send Message
            </Link>
          </div>
        )
      }
    </>
  )
}
Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })
}

export default Contact
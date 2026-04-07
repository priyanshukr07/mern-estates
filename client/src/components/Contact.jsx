import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRightLong } from 'react-icons/fa6';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-3 rounded-[24px] bg-white p-4 text-stone-700 shadow-soft'>
          <p className='text-sm leading-7'>
            Contact <span className='font-semibold'>{landlord.username}</span> about{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>.
          </p>
          <textarea
            name='message'
            id='message'
            rows='4'
            value={message}
            onChange={onChange}
            placeholder='Hi, I would like to know more about availability, pricing, and the next viewing slot.'
            className='w-full rounded-2xl border border-stone-200 bg-stone-50 p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
          ></textarea>

          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className='inline-flex items-center justify-center gap-2 rounded-2xl bg-stone-900 p-3 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-stone-800'
          >
            Send message
            <FaArrowRightLong />
          </Link>
        </div>
      )}
    </>
  );
}

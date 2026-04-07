import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBath, FaBed, FaBolt, FaCar, FaCouch } from 'react-icons/fa6';

export default function ListingItem({ listing }) {
  const price = listing.offer ? listing.discountPrice : listing.regularPrice;
  const savings = listing.offer ? listing.regularPrice - listing.discountPrice : 0;

  return (
    <div className='group w-full overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_90px_-45px_rgba(15,23,42,0.55)] sm:w-[360px]'>
      <Link to={`/listing/${listing._id}`}>
        <div className='relative overflow-hidden'>
          <img
            src={
              listing.imageUrls[0] ||
              'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
            }
            alt='listing cover'
            className='h-[300px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[240px]'
          />
          <div className='absolute inset-x-0 top-0 flex items-start justify-between p-4'>
            <span className='rounded-full bg-stone-900/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur'>
              {listing.type === 'rent' ? 'For rent' : 'For sale'}
            </span>
            {listing.offer && (
              <span className='rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg'>
                Save ${savings.toLocaleString('en-US')}
              </span>
            )}
          </div>
        </div>
        <div className='space-y-4 p-5'>
          <div className='space-y-2'>
            <p className='truncate text-xl font-semibold text-stone-900'>{listing.name}</p>
            <div className='flex items-center gap-1.5 text-sm text-stone-500'>
              <MdLocationOn className='h-4 w-4 text-emerald-700' />
              <p className='truncate'>{listing.address}</p>
            </div>
          </div>
          <p className='line-clamp-2 text-sm leading-6 text-stone-600'>{listing.description}</p>
          <div className='flex items-end justify-between gap-4'>
            <div>
              <p className='text-xs uppercase tracking-[0.18em] text-stone-400'>Guide price</p>
              <p className='mt-1 text-2xl font-semibold text-stone-900'>
                ${price.toLocaleString('en-US')}
                {listing.type === 'rent' && <span className='ml-1 text-sm font-medium text-stone-500'>/ month</span>}
              </p>
            </div>
            {listing.offer && (
              <div className='rounded-2xl bg-emerald-50 px-3 py-2 text-right text-xs font-semibold text-emerald-700'>
                <div className='flex items-center gap-1'>
                  <FaBolt />
                  Special offer
                </div>
              </div>
            )}
          </div>
          <div className='grid grid-cols-2 gap-2 text-sm font-medium text-stone-600'>
            <div className='flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-2'>
              <FaBed className='text-stone-400' />
              {listing.bedrooms} bed
            </div>
            <div className='flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-2'>
              <FaBath className='text-stone-400' />
              {listing.bathrooms} bath
            </div>
            <div className='flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-2'>
              <FaCar className='text-stone-400' />
              {listing.parking ? 'Parking' : 'No parking'}
            </div>
            <div className='flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-2'>
              <FaCouch className='text-stone-400' />
              {listing.furnished ? 'Furnished' : 'Unfurnished'}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

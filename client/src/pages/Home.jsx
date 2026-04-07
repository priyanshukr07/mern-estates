import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import { FaArrowRightLong, FaChartLine, FaHouseSignal, FaKey, FaLocationDot } from 'react-icons/fa6';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [offerRes, rentRes, saleRes] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=4'),
          fetch('/api/listing/get?type=rent&limit=4'),
          fetch('/api/listing/get?type=sale&limit=4'),
        ]);

        const [offerData, rentData, saleData] = await Promise.all([
          offerRes.json(),
          rentRes.json(),
          saleRes.json(),
        ]);

        setOfferListings(offerData);
        setRentListings(rentData);
        setSaleListings(saleData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, []);

  const heroSlides = offerListings.length > 0 ? offerListings : saleListings;

  return (
    <div className='pb-16'>
      <section className='page-shell pt-8'>
        <div className='grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center'>
          <div className='space-y-8 rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-soft backdrop-blur sm:p-10'>
            <span className='inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700'>
              Estate Intelligence
            </span>
            <div className='space-y-5'>
              <h1 className='max-w-3xl font-display text-5xl leading-none text-stone-900 sm:text-6xl lg:text-7xl'>
                Discover homes that feel considered before you ever schedule a tour.
              </h1>
              <p className='max-w-2xl text-base leading-8 text-stone-600 sm:text-lg'>
                Browse standout rentals and sale listings, compare pricing faster, and publish polished properties with a workflow that feels closer to a modern brokerage platform.
              </p>
            </div>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Link
                to='/search'
                className='inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-stone-800'
              >
                Browse inventory
                <FaArrowRightLong />
              </Link>
              <Link
                to='/create-listing'
                className='inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-stone-900 hover:text-stone-900'
              >
                List a property
              </Link>
            </div>
          </div>

          <div className='overflow-hidden rounded-[36px] border border-white/70 bg-stone-900 p-4 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.6)]'>
            {heroSlides && heroSlides.length > 0 ? (
              <Swiper navigation className='rounded-[28px]'>
                {heroSlides.map((listing) => (
                  <SwiperSlide key={listing._id}>
                    <div
                      className='flex h-[520px] items-end rounded-[28px] bg-cover bg-center p-6'
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(28,25,23,0.1), rgba(28,25,23,0.78)), url(${listing.imageUrls[0]})`,
                      }}
                    >
                      <div className='w-full rounded-[24px] bg-white/10 p-5 text-white backdrop-blur-md'>
                        <div className='flex items-center justify-between gap-3'>
                          <span className='rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]'>
                            {listing.offer ? 'Featured offer' : listing.type === 'rent' ? 'Rental pick' : 'Sale pick'}
                          </span>
                          <span className='text-sm font-semibold'>
                            ${Number(listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / mo'}
                          </span>
                        </div>
                        <h2 className='mt-4 font-display text-4xl'>{listing.name}</h2>
                        <p className='mt-3 flex items-center gap-2 text-sm text-stone-200'>
                          <FaLocationDot />
                          {listing.address}
                        </p>
                        <p className='mt-4 line-clamp-2 max-w-xl text-sm leading-7 text-stone-200'>
                          {listing.description}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className='flex h-[520px] rounded-[28px] bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.18),transparent_24%),linear-gradient(160deg,#1c1917_0%,#292524_100%)] p-6'>
                <div className='flex w-full items-end rounded-[24px] bg-white/10 p-6 text-white backdrop-blur-md'>
                  <div className='max-w-2xl space-y-5'>
                    <span className='inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]'>
                      Portfolio spotlight
                    </span>
                    <h2 className='max-w-xl font-display text-4xl leading-tight sm:text-5xl'>
                      Your next standout listing can lead this space.
                    </h2>
                    <p className='max-w-xl text-sm leading-7 text-stone-200 sm:text-base'>
                      Publish your first featured property to unlock the hero showcase on the home page. Until then, visitors can still browse the full market from search.
                    </p>
                    <div className='flex flex-col gap-3 pt-1 sm:flex-row'>
                      <Link
                        to='/create-listing'
                        className='inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-emerald-700'
                      >
                        Create listing
                      </Link>
                      <Link
                        to='/search'
                        className='inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/10'
                      >
                        Explore market
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className='page-shell mt-14'>
        <div className='grid gap-4 rounded-[34px] border border-white/70 bg-white/80 p-6 shadow-soft sm:grid-cols-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Fast browse</p>
            <p className='mt-3 text-lg font-semibold text-stone-900'>Jump straight into sale, rent, or discounted inventory.</p>
          </div>
          <Link to='/search?type=sale' className='rounded-[26px] bg-stone-900 px-5 py-5 text-white transition hover:bg-stone-800'>
            <p className='text-xs uppercase tracking-[0.24em] text-stone-300'>For sale</p>
            <p className='mt-2 text-2xl font-semibold'>Buy a standout home</p>
          </Link>
          <Link to='/search?type=rent' className='rounded-[26px] bg-emerald-600 px-5 py-5 text-white transition hover:bg-emerald-700'>
            <p className='text-xs uppercase tracking-[0.24em] text-emerald-100'>For rent</p>
            <p className='mt-2 text-2xl font-semibold'>Find your next rental</p>
          </Link>
        </div>
      </section>

      <div className='page-shell mt-14 flex flex-col gap-12'>
        {offerListings && offerListings.length > 0 && (
          <div>
            <div className='mb-5 flex items-end justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Special pricing</p>
                <h2 className='mt-2 font-display text-4xl text-stone-900'>Recent offers</h2>
              </div>
              <Link className='text-sm font-semibold text-emerald-700 transition hover:text-emerald-800' to={'/search?offer=true'}>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-6'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className='mb-5 flex items-end justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Move-in ready</p>
                <h2 className='mt-2 font-display text-4xl text-stone-900'>Recent places for rent</h2>
              </div>
              <Link className='text-sm font-semibold text-emerald-700 transition hover:text-emerald-800' to={'/search?type=rent'}>
                Show more rentals
              </Link>
            </div>
            <div className='flex flex-wrap gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className='mb-5 flex items-end justify-between gap-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Ownership opportunities</p>
                <h2 className='mt-2 font-display text-4xl text-stone-900'>Recent places for sale</h2>
              </div>
              <Link className='text-sm font-semibold text-emerald-700 transition hover:text-emerald-800' to={'/search?type=sale'}>
                Show more homes for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

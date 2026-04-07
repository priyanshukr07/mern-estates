import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import { FaArrowTrendDown, FaArrowUpRightFromSquare, FaHouse, FaShieldHeart } from 'react-icons/fa6';
import Contact from '../components/Contact';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (fetchError) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  const mapsUrl = useMemo(() => {
    if (!listing?.address) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`;
  }, [listing?.address]);

  return (
    <main className='pb-16'>
      {loading && <p className='py-12 text-center text-2xl font-semibold text-stone-700'>Loading listing...</p>}
      {error && <p className='py-12 text-center text-2xl font-semibold text-stone-700'>Something went wrong!</p>}

      {listing && !loading && !error && (
        <div className='space-y-8'>
          <section className='page-shell pt-8'>
            <div className='overflow-hidden rounded-[36px] border border-white/70 bg-stone-900 p-4 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.7)]'>
              <Swiper navigation className='rounded-[30px]'>
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div
                      className='flex h-[620px] items-end rounded-[30px] bg-cover bg-center p-6'
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(28,25,23,0.05), rgba(28,25,23,0.8)), url(${url})`,
                      }}
                    >
                      <div className='w-full rounded-[28px] bg-white/10 p-6 text-white backdrop-blur-md'>
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                          <div className='flex flex-wrap gap-2'>
                            <span className='rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]'>
                              {listing.type === 'rent' ? 'For rent' : 'For sale'}
                            </span>
                            {listing.offer && (
                              <span className='rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white'>
                                ${Number(listing.regularPrice - listing.discountPrice).toLocaleString('en-US')} off
                              </span>
                            )}
                          </div>
                          <button
                            type='button'
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className='flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20'
                          >
                            <FaShare />
                          </button>
                        </div>

                        <div className='mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                          <div>
                            <h1 className='font-display text-5xl sm:text-6xl'>{listing.name}</h1>
                            <p className='mt-4 flex items-center gap-2 text-sm text-stone-200'>
                              <FaMapMarkerAlt className='text-emerald-300' />
                              {listing.address}
                            </p>
                          </div>
                          <div className='rounded-[24px] bg-white/10 px-5 py-4 text-right'>
                            <p className='text-xs uppercase tracking-[0.24em] text-stone-300'>Guide price</p>
                            <p className='mt-2 text-4xl font-semibold text-white'>
                              ${Number(listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString('en-US')}
                              {listing.type === 'rent' && <span className='ml-2 text-sm font-medium text-stone-300'>/ month</span>}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            {copied && (
              <p className='mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-soft'>
                Listing link copied
              </p>
            )}
          </section>

          <section className='page-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
            <div className='space-y-6 rounded-[34px] border border-white/70 bg-white/85 p-7 shadow-soft'>
              <div className='flex flex-wrap gap-3'>
                <span className='rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white'>
                  {listing.type === 'rent' ? 'Rental listing' : 'Purchase listing'}
                </span>
                {listing.offer && (
                  <span className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700'>
                    <FaArrowTrendDown />
                    ${Number(listing.regularPrice - listing.discountPrice).toLocaleString('en-US')} savings
                  </span>
                )}
              </div>

              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Property overview</p>
                <p className='mt-4 text-base leading-8 text-stone-600'>{listing.description}</p>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-[26px] bg-stone-50 p-5'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-stone-800'>
                    <FaBed className='text-emerald-700' />
                    Bedrooms
                  </div>
                  <p className='mt-3 text-3xl font-semibold text-stone-900'>{listing.bedrooms}</p>
                </div>
                <div className='rounded-[26px] bg-stone-50 p-5'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-stone-800'>
                    <FaBath className='text-emerald-700' />
                    Bathrooms
                  </div>
                  <p className='mt-3 text-3xl font-semibold text-stone-900'>{listing.bathrooms}</p>
                </div>
                <div className='rounded-[26px] bg-stone-50 p-5'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-stone-800'>
                    <FaParking className='text-emerald-700' />
                    Parking
                  </div>
                  <p className='mt-3 text-lg font-semibold text-stone-900'>
                    {listing.parking ? 'Available' : 'Not included'}
                  </p>
                </div>
                <div className='rounded-[26px] bg-stone-50 p-5'>
                  <div className='flex items-center gap-2 text-sm font-semibold text-stone-800'>
                    <FaChair className='text-emerald-700' />
                    Furnishing
                  </div>
                  <p className='mt-3 text-lg font-semibold text-stone-900'>
                    {listing.furnished ? 'Furnished' : 'Unfurnished'}
                  </p>
                </div>
              </div>
            </div>

            <aside className='space-y-6'>
              <div className='rounded-[34px] bg-stone-900 p-6 text-white shadow-[0_35px_90px_-45px_rgba(15,23,42,0.7)]'>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300'>Quick actions</p>
                <div className='mt-5 space-y-3'>
                  <a
                    href={mapsUrl}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center justify-between rounded-[22px] bg-white/10 px-4 py-4 text-sm font-semibold transition hover:bg-white/15'
                  >
                    Open in maps
                    <FaArrowUpRightFromSquare />
                  </a>
                  {currentUser && listing.userRef !== currentUser._id && !contact && (
                    <button
                      onClick={() => setContact(true)}
                      className='w-full rounded-[22px] bg-emerald-600 px-4 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-emerald-700'
                    >
                      Contact landlord
                    </button>
                  )}
                </div>
                {contact && <div className='mt-5'><Contact listing={listing} /></div>}
              </div>

              <div className='rounded-[34px] border border-white/70 bg-white/85 p-6 shadow-soft'>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Why this listing stands out</p>
                <div className='mt-5 space-y-4 text-sm leading-7 text-stone-600'>
                  <div className='rounded-[24px] bg-stone-50 p-4'>
                    <div className='flex items-center gap-2 font-semibold text-stone-800'>
                      <FaHouse className='text-emerald-700' />
                      Strong essentials
                    </div>
                    <p className='mt-2'>Clear bed and bath counts plus furnishing and parking details make this listing easier to compare.</p>
                  </div>
                  <div className='rounded-[24px] bg-stone-50 p-4'>
                    <div className='flex items-center gap-2 font-semibold text-stone-800'>
                      <FaShieldHeart className='text-emerald-700' />
                      Transparent pricing
                    </div>
                    <p className='mt-2'>Pricing is shown with discount context when an offer is active, which helps buyers and renters understand value instantly.</p>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      )}
    </main>
  );
}

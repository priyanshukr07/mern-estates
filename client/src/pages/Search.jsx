import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowRotateLeft, FaFilter, FaHouse, FaTag } from 'react-icons/fa6';
import ListingItem from '../components/ListingItem';

const defaultFilters = {
  searchTerm: '',
  type: 'all',
  parking: false,
  furnished: false,
  offer: false,
  sort: 'createdAt',
  order: 'desc',
};

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    setSidebarData({
      searchTerm: searchTermFromUrl || '',
      type: typeFromUrl || 'all',
      parking: parkingFromUrl === 'true',
      furnished: furnishedFromUrl === 'true',
      offer: offerFromUrl === 'true',
      sort: sortFromUrl || 'createdAt',
      order: orderFromUrl || 'desc',
    });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setShowMore(data.length > 8);
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const activeFilterCount = useMemo(
    () =>
      Number(Boolean(sidebarData.searchTerm)) +
      Number(sidebarData.type !== 'all') +
      Number(sidebarData.parking) +
      Number(sidebarData.furnished) +
      Number(sidebarData.offer) +
      Number(sidebarData.sort !== 'createdAt' || sidebarData.order !== 'desc'),
    [sidebarData]
  );

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebarData((prev) => ({ ...prev, type: e.target.id }));
    }

    if (e.target.id === 'searchTerm') {
      setSidebarData((prev) => ({ ...prev, searchTerm: e.target.value }));
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebarData((prev) => ({
        ...prev,
        [e.target.id]: e.target.checked,
      }));
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'createdAt';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebarData((prev) => ({ ...prev, sort, order }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleClearFilters = () => {
    setSidebarData(defaultFilters);
    navigate('/search');
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings((prev) => [...prev, ...data]);
  };

  return (
    <main className='page-shell py-10'>
      <div className='mb-8 rounded-[34px] border border-white/70 bg-white/80 p-8 shadow-soft'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.28em] text-stone-500'>Search studio</p>
            <h1 className='mt-3 font-display text-5xl text-stone-900'>Browse the market with sharper filters</h1>
            <p className='mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base'>
              Narrow listings by intent, furnishing, and pricing order, then load more inventory without losing your current filter state.
            </p>
          </div>
          <div className='flex flex-wrap gap-3'>
            <span className='rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white'>
              {listings.length} results
            </span>
            <span className='rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700'>
              {activeFilterCount} active filters
            </span>
          </div>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]'>
        <aside className='rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-soft'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Filter panel</p>
              <h2 className='mt-2 text-2xl font-semibold text-stone-900'>Tune your search</h2>
            </div>
            <FaFilter className='text-stone-400' />
          </div>

          <form onSubmit={handleSubmit} className='mt-6 space-y-6'>
            <div className='space-y-2'>
              <label className='text-sm font-semibold text-stone-800'>Search term</label>
              <input
                type='text'
                id='searchTerm'
                placeholder='Search by title or locality'
                className='w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
                value={sidebarData.searchTerm}
                onChange={handleChange}
              />
            </div>

            <div className='space-y-3'>
              <p className='text-sm font-semibold text-stone-800'>Property intent</p>
              <div className='grid gap-3'>
                {[
                  ['all', 'Rent & sale'],
                  ['rent', 'Rent only'],
                  ['sale', 'Sale only'],
                ].map(([id, label]) => (
                  <label
                    key={id}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      sidebarData.type === id
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type='checkbox'
                      id={id}
                      checked={sidebarData.type === id}
                      onChange={handleChange}
                      className='sr-only'
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className='space-y-3'>
              <p className='text-sm font-semibold text-stone-800'>Features</p>
              <div className='grid gap-3'>
                {[
                  ['offer', 'Special offers'],
                  ['parking', 'Parking included'],
                  ['furnished', 'Move-in furnished'],
                ].map(([id, label]) => (
                  <label
                    key={id}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      sidebarData[id]
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type='checkbox'
                      id={id}
                      checked={sidebarData[id]}
                      onChange={handleChange}
                      className='sr-only'
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-semibold text-stone-800'>Sort by</label>
              <select
                onChange={handleChange}
                value={`${sidebarData.sort}_${sidebarData.order}`}
                id='sort_order'
                className='w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
              >
                <option value='regularPrice_desc'>Price high to low</option>
                <option value='regularPrice_asc'>Price low to high</option>
                <option value='createdAt_desc'>Latest listings</option>
                <option value='createdAt_asc'>Oldest listings</option>
              </select>
            </div>

            <div className='flex flex-col gap-3 pt-2'>
              <button className='rounded-2xl bg-stone-900 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-stone-800'>
                Apply filters
              </button>
              <button
                type='button'
                onClick={handleClearFilters}
                className='inline-flex items-center justify-center gap-2 rounded-2xl border border-stone-300 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-stone-700 transition hover:border-stone-900 hover:text-stone-900'
              >
                <FaArrowRotateLeft />
                Reset
              </button>
            </div>
          </form>
        </aside>

        <section className='space-y-6'>
          <div className='rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-soft'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Result feed</p>
                <h2 className='mt-2 text-3xl font-semibold text-stone-900'>Listing results</h2>
              </div>
              <div className='flex flex-wrap gap-2'>
                {sidebarData.type !== 'all' && (
                  <span className='inline-flex items-center gap-2 rounded-full bg-stone-50 px-3 py-2 text-sm text-stone-600'>
                    <FaHouse /> {sidebarData.type}
                  </span>
                )}
                {sidebarData.offer && (
                  <span className='inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>
                    <FaTag /> offer
                  </span>
                )}
                {sidebarData.searchTerm && (
                  <span className='rounded-full bg-stone-900 px-3 py-2 text-sm text-white'>
                    "{sidebarData.searchTerm}"
                  </span>
                )}
              </div>
            </div>
          </div>

          {!loading && listings.length === 0 && (
            <div className='rounded-[32px] border border-dashed border-stone-300 bg-white/70 p-10 text-center shadow-soft'>
              <p className='text-2xl font-semibold text-stone-900'>No listings matched this search</p>
              <p className='mt-3 text-sm leading-7 text-stone-500'>
                Try widening your filters, removing the keyword, or switching between rent and sale inventory.
              </p>
            </div>
          )}

          {loading && (
            <div className='rounded-[32px] border border-white/70 bg-white/70 p-10 text-center shadow-soft'>
              <p className='text-xl font-semibold text-stone-700'>Loading curated inventory...</p>
            </div>
          )}

          {!loading && listings.length > 0 && (
            <div className='flex flex-wrap gap-6'>
              {listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className='w-full rounded-[26px] border border-stone-300 bg-white/70 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:border-stone-900 hover:text-stone-900'
            >
              Load more listings
            </button>
          )}
        </section>
      </div>
    </main>
  );
}

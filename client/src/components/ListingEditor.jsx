import { FaBath, FaBed, FaCar, FaCouch, FaImages, FaMapPin, FaTag } from 'react-icons/fa6';

const inputClassName =
  'w-full rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 text-sm text-stone-700 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100';

const selectionClassName = (active) =>
  `flex items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
    active
      ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-200'
      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
  }`;

const amenityClassName = (active) =>
  `flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
    active
      ? 'border-stone-900 bg-stone-900 text-white'
      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
  }`;

export default function ListingEditor({
  mode,
  formData,
  files,
  setFiles,
  imageUploadError,
  uploading,
  loading,
  error,
  onChange,
  onImageSubmit,
  onRemoveImage,
  onSubmit,
}) {
  const headline =
    mode === 'create' ? 'Create a Market-Ready Listing' : 'Refine Your Listing';
  const description =
    mode === 'create'
      ? 'Shape a polished property card with pricing, amenities, and a strong visual first impression.'
      : 'Keep your listing current with sharper pricing, fresher photos, and updated details.';
  const actionLabel = mode === 'create' ? 'Publish listing' : 'Save changes';
  const selectedFilesCount = files?.length || 0;
  const priceValue = Number(formData.offer ? formData.discountPrice : formData.regularPrice) || 0;
  const savings =
    formData.offer && formData.regularPrice
      ? Number(formData.regularPrice) - Number(formData.discountPrice || 0)
      : 0;

  return (
    <main className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
      <section className='grid gap-8 lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur xl:p-8'>
          <div className='mb-8 space-y-3'>
            <span className='inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700'>
              Listing Studio
            </span>
            <h1 className='font-display text-4xl text-stone-900 sm:text-5xl'>
              {headline}
            </h1>
            <p className='max-w-2xl text-sm leading-7 text-stone-600 sm:text-base'>
              {description}
            </p>
          </div>

          <form onSubmit={onSubmit} className='space-y-8'>
            <div className='grid gap-6 xl:grid-cols-2'>
              <div className='space-y-2 xl:col-span-2'>
                <label htmlFor='name' className='text-sm font-semibold text-stone-800'>
                  Property title
                </label>
                <input
                  id='name'
                  type='text'
                  minLength='10'
                  maxLength='62'
                  required
                  value={formData.name}
                  onChange={onChange}
                  placeholder='Modern sea-view apartment in Bandra West'
                  className={inputClassName}
                />
              </div>

              <div className='space-y-2 xl:col-span-2'>
                <label htmlFor='description' className='text-sm font-semibold text-stone-800'>
                  Listing story
                </label>
                <textarea
                  id='description'
                  rows='5'
                  required
                  value={formData.description}
                  onChange={onChange}
                  placeholder='Highlight the layout, natural light, neighborhood vibe, and why this property stands out.'
                  className={`${inputClassName} resize-none`}
                />
              </div>

              <div className='space-y-2 xl:col-span-2'>
                <label htmlFor='address' className='text-sm font-semibold text-stone-800'>
                  Address
                </label>
                <div className='relative'>
                  <FaMapPin className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400' />
                  <input
                    id='address'
                    type='text'
                    required
                    value={formData.address}
                    onChange={onChange}
                    placeholder='24 Palm Avenue, Koramangala, Bengaluru'
                    className={`${inputClassName} pl-11`}
                  />
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <p className='text-sm font-semibold text-stone-800'>Listing intent</p>
                <p className='mt-1 text-sm text-stone-500'>
                  Choose how the property should appear across search and listing cards.
                </p>
              </div>
              <div className='grid gap-3 sm:grid-cols-2'>
                <label className={selectionClassName(formData.type === 'sale')}>
                  <input
                    type='checkbox'
                    id='sale'
                    checked={formData.type === 'sale'}
                    onChange={onChange}
                    className='sr-only'
                  />
                  For sale
                </label>
                <label className={selectionClassName(formData.type === 'rent')}>
                  <input
                    type='checkbox'
                    id='rent'
                    checked={formData.type === 'rent'}
                    onChange={onChange}
                    className='sr-only'
                  />
                  For rent
                </label>
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <p className='text-sm font-semibold text-stone-800'>Property standards</p>
                <p className='mt-1 text-sm text-stone-500'>
                  Add the essentials buyers and renters expect to compare quickly.
                </p>
              </div>
              <div className='grid gap-3 sm:grid-cols-3'>
                <label className={amenityClassName(formData.parking)}>
                  <input
                    type='checkbox'
                    id='parking'
                    checked={formData.parking}
                    onChange={onChange}
                    className='sr-only'
                  />
                  <FaCar />
                  Parking
                </label>
                <label className={amenityClassName(formData.furnished)}>
                  <input
                    type='checkbox'
                    id='furnished'
                    checked={formData.furnished}
                    onChange={onChange}
                    className='sr-only'
                  />
                  <FaCouch />
                  Furnished
                </label>
                <label className={amenityClassName(formData.offer)}>
                  <input
                    type='checkbox'
                    id='offer'
                    checked={formData.offer}
                    onChange={onChange}
                    className='sr-only'
                  />
                  <FaTag />
                  Active offer
                </label>
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
              <div className='rounded-3xl border border-stone-200 bg-stone-50 p-4'>
                <label htmlFor='bedrooms' className='flex items-center gap-2 text-sm font-semibold text-stone-800'>
                  <FaBed className='text-stone-500' />
                  Bedrooms
                </label>
                <input
                  id='bedrooms'
                  type='number'
                  min='1'
                  max='10'
                  required
                  value={formData.bedrooms}
                  onChange={onChange}
                  className={`${inputClassName} mt-3 bg-white`}
                />
              </div>
              <div className='rounded-3xl border border-stone-200 bg-stone-50 p-4'>
                <label htmlFor='bathrooms' className='flex items-center gap-2 text-sm font-semibold text-stone-800'>
                  <FaBath className='text-stone-500' />
                  Bathrooms
                </label>
                <input
                  id='bathrooms'
                  type='number'
                  min='1'
                  max='10'
                  required
                  value={formData.bathrooms}
                  onChange={onChange}
                  className={`${inputClassName} mt-3 bg-white`}
                />
              </div>
              <div className='rounded-3xl border border-stone-200 bg-stone-50 p-4'>
                <label htmlFor='regularPrice' className='text-sm font-semibold text-stone-800'>
                  {formData.type === 'rent' ? 'Monthly rent' : 'Asking price'}
                </label>
                <input
                  id='regularPrice'
                  type='number'
                  min='50'
                  max='10000000'
                  required
                  value={formData.regularPrice}
                  onChange={onChange}
                  className={`${inputClassName} mt-3 bg-white`}
                />
              </div>
              <div className='rounded-3xl border border-stone-200 bg-stone-50 p-4'>
                <label htmlFor='discountPrice' className='text-sm font-semibold text-stone-800'>
                  Offer price
                </label>
                <input
                  id='discountPrice'
                  type='number'
                  min='0'
                  max='10000000'
                  disabled={!formData.offer}
                  required={formData.offer}
                  value={formData.discountPrice}
                  onChange={onChange}
                  className={`${inputClassName} mt-3 bg-white disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400`}
                />
              </div>
            </div>

            <div className='rounded-[28px] border border-stone-200 bg-stone-50/80 p-5'>
              <div className='flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between'>
                <div className='max-w-2xl space-y-2'>
                  <h2 className='flex items-center gap-2 text-lg font-semibold text-stone-900'>
                    <FaImages className='text-emerald-600' />
                    Media gallery
                  </h2>
                  <p className='text-sm leading-6 text-stone-500'>
                    Upload up to 6 images. The first image becomes the cover on home, search, and listing pages.
                  </p>
                </div>
                <div className='rounded-2xl bg-white px-4 py-3 text-sm text-stone-500 shadow-sm'>
                  {formData.imageUrls.length} uploaded | {selectedFilesCount} selected
                </div>
              </div>

              <div className='mt-5 flex flex-col gap-3 lg:flex-row'>
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  className={`${inputClassName} cursor-pointer`}
                  type='file'
                  id='images'
                  accept='image/*'
                  multiple
                />
                <button
                  type='button'
                  disabled={uploading}
                  onClick={onImageSubmit}
                  className='rounded-2xl border border-emerald-600 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {uploading ? 'Uploading images...' : 'Upload selected'}
                </button>
              </div>

              {imageUploadError && (
                <p className='mt-3 text-sm font-medium text-rose-600'>{imageUploadError}</p>
              )}

              <div className='mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className='overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-sm'
                  >
                    <div className='relative h-44 overflow-hidden'>
                      <img src={url} alt='listing preview' className='h-full w-full object-cover' />
                      {index === 0 && (
                        <span className='absolute left-3 top-3 rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold text-white'>
                          Cover photo
                        </span>
                      )}
                    </div>
                    <div className='flex items-center justify-between px-4 py-3'>
                      <span className='text-sm text-stone-500'>Image {index + 1}</span>
                      <button
                        type='button'
                        onClick={() => onRemoveImage(index)}
                        className='text-sm font-semibold text-rose-600 transition hover:text-rose-700'
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-4 border-t border-stone-200 pt-6'>
              {error && <p className='rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700'>{error}</p>}
              <button
                disabled={loading || uploading}
                className='rounded-2xl bg-stone-900 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {loading ? (mode === 'create' ? 'Publishing...' : 'Saving...') : actionLabel}
              </button>
            </div>
          </form>
        </div>

        <aside className='space-y-6'>
          <div className='rounded-[32px] bg-stone-900 p-6 text-white shadow-[0_25px_80px_-40px_rgba(15,23,42,0.55)]'>
            <p className='text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300'>
              Live Preview
            </p>
            <div className='mt-6 overflow-hidden rounded-[28px] bg-stone-800'>
              <div
                className='h-60 bg-cover bg-center'
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(12,10,9,0.05), rgba(12,10,9,0.6)), url(${
                    formData.imageUrls[0] ||
                    'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80'
                  })`,
                }}
              />
              <div className='space-y-4 p-5'>
                <div className='flex items-center justify-between gap-3'>
                  <span className='rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-100'>
                    {formData.type === 'rent' ? 'For rent' : 'For sale'}
                  </span>
                  {formData.offer && savings > 0 && (
                    <span className='rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300'>
                      Save ${savings.toLocaleString('en-US')}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className='font-display text-2xl text-white'>
                    {formData.name || 'Property title preview'}
                  </h2>
                  <p className='mt-2 text-sm leading-6 text-stone-300'>
                    {formData.description || 'Your description will appear here with the exact tone buyers and renters will read first.'}
                  </p>
                </div>
                <div className='rounded-2xl bg-white/5 p-4'>
                  <p className='text-xs uppercase tracking-[0.22em] text-stone-400'>Guide price</p>
                  <p className='mt-2 text-3xl font-semibold text-white'>
                    ${priceValue.toLocaleString('en-US')}
                    {formData.type === 'rent' && (
                      <span className='ml-2 text-sm font-medium text-stone-300'>/ month</span>
                    )}
                  </p>
                  <div className='mt-4 flex flex-wrap gap-2 text-xs text-stone-300'>
                    <span className='rounded-full bg-white/10 px-3 py-2'>
                      {formData.bedrooms || 0} bed
                    </span>
                    <span className='rounded-full bg-white/10 px-3 py-2'>
                      {formData.bathrooms || 0} bath
                    </span>
                    <span className='rounded-full bg-white/10 px-3 py-2'>
                      {formData.parking ? 'Parking' : 'No parking'}
                    </span>
                    <span className='rounded-full bg-white/10 px-3 py-2'>
                      {formData.furnished ? 'Furnished' : 'Unfurnished'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.25)]'>
            <h3 className='text-lg font-semibold text-stone-900'>Publishing checklist</h3>
            <ul className='mt-4 space-y-3 text-sm text-stone-600'>
              <li className='rounded-2xl bg-stone-50 px-4 py-3'>Use a title with a location cue and standout feature.</li>
              <li className='rounded-2xl bg-stone-50 px-4 py-3'>Keep the first image as the strongest exterior or living-area shot.</li>
              <li className='rounded-2xl bg-stone-50 px-4 py-3'>Offer pricing should stay below the regular price to highlight savings.</li>
              <li className='rounded-2xl bg-stone-50 px-4 py-3'>Add both parking and furnishing details so the search filters stay accurate.</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}

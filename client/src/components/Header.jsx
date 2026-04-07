import { FaSearch } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { FaArrowRightLong, FaHouseChimneyWindow } from 'react-icons/fa6';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='sticky top-0 z-40 border-b border-white/60 bg-[#fcfbf8]/80 backdrop-blur-xl'>
      <div className='page-shell'>
        <div className='flex flex-col gap-4 py-4'>
          <div className='flex items-center justify-between gap-4'>
            <Link to='/' className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-soft'>
                <FaHouseChimneyWindow />
              </div>
              <div>
                <p className='font-display text-3xl leading-none text-stone-900 sm:text-4xl'>
                  Priyanshu Estate
                </p>
                <p className='text-xs uppercase tracking-[0.28em] text-stone-500'>
                  Curated homes and strong first impressions
                </p>
              </div>
            </Link>
            <div className='hidden items-center gap-3 lg:flex'>
              <Link
                to='/search'
                className='rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-900 hover:text-stone-900'
              >
                Explore listings
              </Link>
              <Link
                to={currentUser ? '/create-listing' : '/sign-in'}
                className='inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800'
              >
                {currentUser ? 'Create listing' : 'Sign in'}
                <FaArrowRightLong className='text-xs' />
              </Link>
            </div>
          </div>

          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <form
              onSubmit={handleSubmit}
              className='flex flex-1 items-center gap-3 rounded-[22px] border border-white/70 bg-white/85 px-4 py-3 shadow-soft'
            >
              <FaSearch className='text-stone-400' />
              <input
                type='text'
                placeholder='Search by title, area, or neighborhood...'
                className='w-full bg-transparent text-sm text-stone-700 outline-none'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className='rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700'>
                Search
              </button>
            </form>

            <nav className='flex items-center gap-2 text-sm font-semibold text-stone-600'>
              <Link
                to='/'
                className={`rounded-full px-4 py-2 transition ${
                  location.pathname === '/' ? 'bg-stone-900 text-white' : 'hover:bg-white/70'
                }`}
              >
                Home
              </Link>
              <Link
                to='/search'
                className={`rounded-full px-4 py-2 transition ${
                  location.pathname === '/search' ? 'bg-stone-900 text-white' : 'hover:bg-white/70'
                }`}
              >
                Search
              </Link>
              <Link
                to='/about'
                className={`rounded-full px-4 py-2 transition ${
                  location.pathname === '/about' ? 'bg-stone-900 text-white' : 'hover:bg-white/70'
                }`}
              >
                About
              </Link>
              <Link
                to='/profile'
                className='ml-2 flex items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-3 py-2 text-stone-700 transition hover:border-stone-900'
              >
                {currentUser ? (
                  <>
                    <img className='h-8 w-8 rounded-full object-cover' src={currentUser.avatar} alt='profile' />
                    <span className='hidden sm:inline'>{currentUser.username}</span>
                  </>
                ) : (
                  <span>Account</span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

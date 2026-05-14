import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { searchMedia } from '../api/api';

export default function Navbar({ onSearchResults }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  async function handleSearch(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearching(true);
    try {
      const results = await searchMedia(trimmed);
      if (onSearchResults) {
        onSearchResults(results, trimmed);
      }
    } catch {
      // ignore
    } finally {
      setSearching(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-black/90 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-[24px] font-black text-[#e50914] tracking-tight no-underline">
          Streaming-Platform
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-[#e5e5e5] hover:text-white text-sm no-underline">Home</Link>
          <Link to="/movies" className="text-[#e5e5e5] hover:text-white text-sm no-underline">Movies</Link>
          <Link to="/series" className="text-[#e5e5e5] hover:text-white text-sm no-underline">Series</Link>
          <Link to="/favorites" className="text-[#e5e5e5] hover:text-white text-sm no-underline">Favorites</Link>
          <Link to="/sessions" className="text-[#e5e5e5] hover:text-white text-sm no-underline">Watch Together</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {onSearchResults && (
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <input
              type="text"
              placeholder="Search titles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-3 py-1.5 bg-[#333] border border-[#555] rounded-l text-white text-sm outline-none focus:border-[#e50914] placeholder-[#8c8c8c] w-50"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-3 py-1.5 bg-[#555] hover:bg-[#666] rounded-r text-white text-sm cursor-pointer border border-[#555]"
            >
              {searching ? '...' : 'Search'}
            </button>
          </form>
        )}
        <Link to="/profile" className="text-[#e5e5e5] hover:text-white text-sm no-underline">Profile</Link>
        <button
          onClick={handleLogout}
          className="px-4 py-1.5 bg-[#e50914] hover:bg-[#f40612] rounded text-white text-sm font-bold cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getAllMedia, getWatchHistory, getFavorites } from '../api/api';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';

export default function Home() {
  const [allMedia, setAllMedia] = useState([]);
  const [displayMedia, setDisplayMedia] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [watchedIds, setWatchedIds] = useState(new Set());
  const [progressMap, setProgressMap] = useState(new Map());
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAllMedia(), getWatchHistory(), getFavorites()])
      .then(([mediaData, historyData, favData]) => {
        setAllMedia(mediaData);
        setDisplayMedia(mediaData);
        setContinueWatching(historyData.filter((h) => !h.completed && h.progressSeconds > 0));
        setWatchedIds(new Set(historyData.filter((h) => h.completed).map((h) => h.mediaId)));
        const pm = new Map();
        historyData.forEach((h) => {
          if (h.progressSeconds > 0) {
            const m = mediaData.find((x) => x.id === h.mediaId);
            if (m && m.durationSeconds) pm.set(h.mediaId, Math.min(100, Math.round((h.progressSeconds / m.durationSeconds) * 100)));
          }
        });
        setProgressMap(pm);
        setFavoriteIds(new Set(favData.map((f) => f.id)));
      })
      .catch(() => {
        logout();
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSearchResults(results, term) {
    setDisplayMedia(results);
    setSearchTerm(term);
  }

  function clearSearch() {
    setDisplayMedia(allMedia);
    setSearchTerm('');
  }

  const genres = [...new Set(allMedia.map((m) => m.genre).filter(Boolean))];
  const grouped = searchTerm
    ? null
    : genres.reduce((acc, genre) => {
        acc[genre] = allMedia.filter((m) => m.genre === genre);
        return acc;
      }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar onSearchResults={handleSearchResults} />

      <main className="px-8 py-8">
        {searchTerm ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-white text-[24px] font-bold">
                Results for "{searchTerm}"
              </h1>
              <button onClick={clearSearch} className="text-[#e50914] hover:underline text-sm cursor-pointer">
                Clear search
              </button>
            </div>
            {displayMedia.length === 0 ? (
              <p className="text-[#737373] text-base">No results found.</p>
            ) : (
              <MediaGrid media={displayMedia} watchedIds={watchedIds} progressMap={progressMap} favoriteIds={favoriteIds} />
            )}
          </>
        ) : allMedia.length === 0 ? (
          <p className="text-[#737373] text-base">No media available yet.</p>
        ) : (
          <>
            {continueWatching.length > 0 && (
              <div className="mb-8">
                <h2 className="text-white text-xl font-bold mb-4">Continue Watching</h2>
                <Carousel>
                  {continueWatching.map((item) => (
                    <Link to={'/watch/' + item.mediaId} key={item.mediaId} className="group cursor-pointer no-underline flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] xl:w-[calc(16.666%-14px)]">
                      <div className="aspect-video bg-[#333] rounded overflow-hidden relative">
                        {allMedia.find((m) => m.id === item.mediaId)?.thumbnailUrl ? (
                          <img
                            src={allMedia.find((m) => m.id === item.mediaId).thumbnailUrl}
                            alt={item.mediaTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#737373] text-sm">
                            {item.mediaTitle}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#333]">
                          <div
                            className="h-full bg-[#e50914]"
                            style={{ width: formatProgress(item.progressSeconds, item.mediaId) }}
                          />
                        </div>
                      </div>
                      <p className="text-white text-sm mt-2 truncate">{item.mediaTitle}</p>
                      <p className="text-[#737373] text-xs">{formatTime(item.progressSeconds)} watched</p>
                    </Link>
                  ))}
                </Carousel>
              </div>
            )}
            {genres.map((genre) => (
              <div key={genre} className="mb-8">
                <h2 className="text-white text-xl font-bold mb-4">{genre}</h2>
                <MediaGrid media={grouped[genre]} watchedIds={watchedIds} progressMap={progressMap} favoriteIds={favoriteIds} />
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );

  function formatProgress(progressSeconds, mediaId) {
    const media = allMedia.find((m) => m.id === mediaId);
    if (!media || !media.durationSeconds) return '0%';
    return Math.min(100, Math.round((progressSeconds / media.durationSeconds) * 100)) + '%';
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + String(s).padStart(2, '0');
  }
}

function MediaGrid({ media, watchedIds, progressMap, favoriteIds }) {
  return (
    <Carousel>
      {media.map((item) => (
        <Link to={'/watch/' + item.id} key={item.id} className="group cursor-pointer no-underline flex-none w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] xl:w-[calc(16.666%-14px)]">
          <div className="aspect-video bg-[#333] rounded overflow-hidden relative">
            {item.thumbnailUrl ? (
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#737373] text-sm">
                No thumbnail
              </div>
            )}
            {favoriteIds.has(item.id) && (
              <div className="absolute top-2 left-2 text-[#FFD700] text-lg drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">★</div>
            )}
            {watchedIds.has(item.id) && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {progressMap.has(item.id) && !watchedIds.has(item.id) && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#333]">
                <div className="h-full bg-[#e50914]" style={{ width: progressMap.get(item.id) + '%' }} />
              </div>
            )}
          </div>
          <p className="text-white text-sm mt-2 truncate">{item.title}</p>
          {item.genre && <p className="text-[#737373] text-xs">{item.genre}</p>}
        </Link>
      ))}
    </Carousel>
  );
}

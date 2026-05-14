import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getFavorites } from '../api/api';
import Navbar from '../components/Navbar';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch(() => {
        logout();
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />

      <main className="px-8 py-8">
        <h1 className="text-white text-[28px] font-bold mb-6">My Favorites</h1>

        {favorites.length === 0 ? (
          <p className="text-[#737373] text-base">You haven't added any favorites yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((item) => (
              <Link to={'/watch/' + item.id} key={item.id} className="group cursor-pointer no-underline">
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
                </div>
                <p className="text-white text-sm mt-2 truncate">{item.title}</p>
                <p className="text-[#737373] text-xs">{item.genre} · {item.type}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

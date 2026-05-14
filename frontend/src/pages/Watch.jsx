import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { getMediaById, getStreamInfo, saveProgress, saveProgressTick, createSession, isFavorite, addToFavorites, removeFromFavorites } from '../api/api';
import Navbar from '../components/Navbar';

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const [media, setMedia] = useState(null);
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const progressRef = useRef(0);
  const durationRef = useRef(0);
  const savedProgressRef = useRef(0);
  const hasResumed = useRef(false);

  useEffect(() => {
    Promise.all([getMediaById(id), getStreamInfo(id), isFavorite(id)])
      .then(([mediaData, streamData, favData]) => {
        setMedia(mediaData);
        setStreamUrl(streamData.videoUrl);
        savedProgressRef.current = streamData.savedProgressSeconds || 0;
        hasResumed.current = false;
        setFavorited(favData.favorite);
      })
      .catch((err) => setError(err.message || 'Failed to load media'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTickSave = useCallback(() => {
    if (progressRef.current > 0) {
      saveProgressTick(id, Math.floor(progressRef.current)).catch(() => {});
    }
  }, [id]);

  const handlePersistSave = useCallback(() => {
    if (progressRef.current > 0) {
      saveProgress(id, Math.floor(progressRef.current), progressRef.current >= durationRef.current - 5).catch(() => {});
    }
  }, [id]);

  useEffect(() => {
    const interval = setInterval(handleTickSave, 15000);
    return () => {
      clearInterval(interval);
      handlePersistSave();
    };
  }, [handleTickSave, handlePersistSave]);

  async function handleToggleFavorite() {
    try {
      if (favorited) {
        await removeFromFavorites(id);
        setFavorited(false);
      } else {
        await addToFavorites(id);
        setFavorited(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to update favorites');
    }
  }

  async function handleWatchTogether() {
    try {
      const session = await createSession(Number(id));
      navigate('/session/' + session.roomId);
    } catch (err) {
      setError(err.message || 'Failed to create session');
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#e87c03] text-lg mb-4">{error}</p>
          <Link to="/" className="text-[#e50914] hover:underline">Back to browse</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />

      <main className="max-w-300 mx-auto px-4 py-6">
        <div className="aspect-video bg-black rounded overflow-hidden mb-6">
          <ReactPlayer
            ref={playerRef}
            src={streamUrl}
            width="100%"
            height="100%"
            playing={playing}
            controls
            onPlay={() => setPlaying(true)}
            onPause={() => { setPlaying(false); handlePersistSave(); }}
            onTimeUpdate={(e) => { progressRef.current = e.target.currentTime; }}
            onLoadedMetadata={(e) => {
              durationRef.current = e.target.duration;
              if (!hasResumed.current && savedProgressRef.current > 0) {
                e.target.currentTime = savedProgressRef.current;
                hasResumed.current = true;
              }
            }}
            onEnded={() => {
              saveProgress(id, Math.floor(durationRef.current), true).catch(() => {});
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-white text-[28px] font-bold">{media.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-[#737373] text-sm">
              {media.releaseYear && <span>{media.releaseYear}</span>}
              {media.genre && <span>{media.genre}</span>}
              {media.type && <span className="uppercase">{media.type}</span>}
              {media.durationSeconds > 0 && <span>{formatTime(media.durationSeconds)}</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleFavorite}
              className={`px-6 py-3 rounded text-sm font-bold cursor-pointer whitespace-nowrap ${
                favorited
                  ? 'bg-[#FFD700]/20 hover:bg-[#FFD700]/30 border border-[#FFD700] text-[#FFD700] text-xl'
                  : 'bg-[#333] hover:bg-[#444] border border-[#555] text-white'
              }`}
            >
              {favorited ? '★' : '☆ Add to Favorites'}
            </button>
            <button
              onClick={handleWatchTogether}
              className="px-6 py-3 bg-[#e50914] hover:bg-[#f40612] rounded text-white text-sm font-bold cursor-pointer whitespace-nowrap"
            >
              Watch Together
            </button>
          </div>
        </div>

        {media.description && (
          <p className="text-[#b3b3b3] text-base leading-relaxed max-w-200">
            {media.description}
          </p>
        )}
      </main>
    </div>
  );
}

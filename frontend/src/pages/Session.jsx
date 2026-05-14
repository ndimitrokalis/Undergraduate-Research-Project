import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Client } from '@stomp/stompjs';
import { getSession, getStreamInfo, endSession } from '../api/api';
import useAuthStore from '../store/authStore';
import Navbar from '../components/Navbar';

function parseJwtSub(jwt) {
  try {
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    return payload.sub;
  } catch {
    return '';
  }
}

export default function Session() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const stompRef = useRef(null);
  const ignoreNextEvent = useRef(false);

  const [session, setSession] = useState(null);
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef(null);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hostEmail, setHostEmail] = useState('');
  const [hostDisplayName, setHostDisplayName] = useState('');
  const [members, setMembers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [notification, setNotification] = useState('');
  const hasResumed = useRef(false);
  const notificationTimer = useRef(null);
  const currentTimeRef = useRef(0);
  const playingRef = useRef(false);
  const isHostRef = useRef(false);
  const containerRef = useRef(null);

  const token = useAuthStore((s) => s.token);
  const currentEmail = token ? parseJwtSub(token) : '';
  const isHost = currentEmail !== '' && currentEmail === hostEmail;

  useEffect(() => { isHostRef.current = isHost; }, [isHost]);

  function showNotification(msg) {
    setNotification(msg);
    if (notificationTimer.current) clearTimeout(notificationTimer.current);
    notificationTimer.current = setTimeout(() => setNotification(''), 4000);
  }

  useEffect(() => {
    getSession(roomId)
      .then((data) => {
        setSession(data);
        setHostEmail(data.hostEmail);
        setHostDisplayName(data.hostDisplayName);
        if (data.members) setMembers(data.members);
        return getStreamInfo(data.mediaId);
      })
      .then((streamData) => {
        setStreamUrl(streamData.videoUrl);
      })
      .catch((err) => setError(err.message || 'Session not found'))
      .finally(() => setLoading(false));
  }, [roomId]);

  const handleSyncMessage = useCallback((data) => {
    if (data.type === 'SESSION_ENDED') {
      navigate('/');
      return;
    }

    if (data.type === 'HOST_CHANGE') {
      setHostEmail(data.newHostEmail);
      setHostDisplayName(data.newHostDisplayName);
      showNotification(data.newHostDisplayName + ' is now the host');
      if (data.participants) setParticipants(data.participants);
      return;
    }

    if (data.type === 'JOIN') {
      if (data.participants) setParticipants(data.participants);
      setMembers((prev) => {
        if (prev.some((m) => m.email === data.userId)) return prev;
        return [...prev, { email: data.userId, displayName: data.displayName }];
      });
      if (data.userId !== currentEmail) {
        showNotification(data.displayName + ' joined');
      }
      return;
    }

    if (data.type === 'LEAVE') {
      if (data.participants) setParticipants(data.participants);
      showNotification(data.displayName + ' disconnected');
      return;
    }

    if (data.type === 'SYNC') {
      if (data.timestamp != null && playerRef.current) {
        const video = playerRef.current.getInternalPlayer?.() || playerRef.current;
        if (video && typeof video.currentTime === 'number') {
          video.currentTime = parseFloat(data.timestamp);
        }
      }
      playingRef.current = data.playing === true;
      setPlaying(data.playing === true);
      if (data.newHostEmail) setHostEmail(data.newHostEmail);
      if (data.participants) setParticipants(data.participants);
      return;
    }

    if (isHostRef.current) return;

    ignoreNextEvent.current = true;

    if (data.timestamp != null && playerRef.current) {
      const video = playerRef.current.getInternalPlayer?.() || playerRef.current;
      if (video && typeof video.currentTime === 'number') {
        video.currentTime = parseFloat(data.timestamp);
      }
    }

    if (data.type === 'PLAY') {
      playingRef.current = true;
      setPlaying(true);
    } else if (data.type === 'PAUSE') {
      playingRef.current = false;
      setPlaying(false);
    }

    setTimeout(() => { ignoreNextEvent.current = false; }, 500);
  }, [currentEmail, navigate]);

  useEffect(() => {
    if (!session || !token) return;

    const userId = parseJwtSub(token);
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = wsProtocol + '//' + window.location.host + '/ws/websocket';

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);

        client.subscribe('/topic/session/' + roomId, (msg) => {
          const data = JSON.parse(msg.body);
          handleSyncMessage(data);
        });

        client.publish({
          destination: '/app/session/' + roomId + '/sync',
          body: JSON.stringify({ userId, roomId }),
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    stompRef.current = client;

    return () => {
      if (stompRef.current) {
        stompRef.current.deactivate();
      }
    };
  }, [session, token, roomId, handleSyncMessage]);

  function sendMessage(type, timestamp) {
    if (!stompRef.current || !connected) return;
    const userId = parseJwtSub(token);

    stompRef.current.publish({
      destination: '/app/session/' + roomId + '/' + type,
      body: JSON.stringify({
        userId,
        roomId,
        timestamp: String(timestamp || 0),
      }),
    });
  }

  function getCurrentTime() {
    return currentTimeRef.current;
  }

  function handlePlay() {
    if (!isHost) return;
    playingRef.current = true;
    sendMessage('play', getCurrentTime());
  }

  function handlePause() {
    if (!isHost) return;
    playingRef.current = false;
    sendMessage('pause', getCurrentTime());
  }

  function handleSeeked(e) {
    if (ignoreNextEvent.current) return;
    if (!isHost) return;
    const time = e.target.currentTime;
    sendMessage(playingRef.current ? 'play' : 'pause', time);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function handleMouseMove() {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 3000);
  }

  function handleMouseLeave() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 1000);
  }

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }

  async function handleEndSession() {
    try {
      await endSession(roomId);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white text-xl">Loading session...</div>
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
        <div
          ref={containerRef}
          className="relative aspect-video bg-black rounded overflow-hidden mb-4"
          onMouseMove={!isHost ? handleMouseMove : undefined}
          onMouseLeave={!isHost ? handleMouseLeave : undefined}
        >
          <ReactPlayer
            ref={playerRef}
            src={streamUrl}
            width="100%"
            height="100%"
            playing={playing}
            volume={volume}
            muted={muted}
            controls={isHost}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={handleSeeked}
            onTimeUpdate={(e) => {
              currentTimeRef.current = e.target.currentTime;
              if (!isHost) setPlayed(e.target.currentTime);
            }}
            onLoadedMetadata={(e) => {
              if (!isHost) setDuration(e.target.duration);
              if (!hasResumed.current && session.playbackTimestamp > 0) {
                e.target.currentTime = session.playbackTimestamp;
                hasResumed.current = true;
              }
            }}
          />

          {!isHost && (
            <div
              className="absolute bottom-0 left-0 right-0 transition-opacity duration-300"
              style={{ opacity: showControls ? 1 : 0 }}
            >
              <div style={{ background: 'rgba(0,0,0,0.65)' }} className="px-3 py-2">
                <div className="flex items-center gap-2 h-8">
                  <div className="relative flex-1 h-3 flex items-center">
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center">
                      <div className="w-full h-1" style={{ background: 'rgba(255,255,255,0.2)' }} />
                    </div>
                    <div className="absolute inset-y-0 left-0 flex items-center" style={{ width: duration > 0 ? (played / duration * 100) + '%' : '0%' }}>
                      <div className="w-full h-1" style={{ background: '#38bdf8' }} />
                    </div>
                    <div
                      className="absolute top-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        left: duration > 0 ? 'calc(' + (played / duration * 100) + '% - 6px)' : '0',
                        width: 12,
                        height: 12,
                        background: '#ffffff',
                      }}
                    />
                  </div>
                  <span className="text-white/90 text-xs shrink-0 mx-1">
                    {formatTime(played)} / {formatTime(duration)}
                  </span>
                  <button
                    onClick={() => setMuted((m) => !m)}
                    className="w-7 h-7 flex items-center justify-center text-white cursor-pointer shrink-0 hover:text-white/80"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      {muted || volume === 0 ? (
                        <path d="M11 5L6.5 9H3.5A1.5 1.5 0 002 10.5v3A1.5 1.5 0 003.5 15h3L11 19V5zm7.07.93l-1.41 1.41A6.97 6.97 0 0119 12a6.97 6.97 0 01-2.34 4.66l1.41 1.41A8.97 8.97 0 0021 12a8.97 8.97 0 00-2.93-6.07zM15.54 8.46l-1.42 1.42A2.97 2.97 0 0115 12c0 .78-.3 1.5-.88 2.12l1.42 1.42A4.97 4.97 0 0017 12a4.97 4.97 0 00-1.46-3.54z" />
                      ) : (
                        <path d="M11 5L6.5 9H3.5A1.5 1.5 0 002 10.5v3A1.5 1.5 0 003.5 15h3L11 19V5zm5.5 7a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12zm-2.5-7.77v1.79A6.5 6.5 0 0118.5 12a6.5 6.5 0 01-4.5 6.18v1.79A8.5 8.5 0 0020.5 12a8.5 8.5 0 00-6.5-7.77z" />
                      )}
                    </svg>
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={muted ? 0 : volume}
                    onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                    className="w-16 accent-white cursor-pointer"
                  />
                  <button
                    onClick={toggleFullscreen}
                    className="w-7 h-7 flex items-center justify-center text-white cursor-pointer shrink-0 hover:text-white/80"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h7v2H5v5H3V3zm11 0h7v7h-2V5h-5V3zM3 14h2v5h5v2H3v-7zm18 0v7h-7v-2h5v-5h2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {notification && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-4 py-2 rounded pointer-events-none transition-opacity duration-300">
              {notification}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-white text-xl font-bold">{session.mediaTitle}</h1>
            <p className="text-[#737373] text-sm mt-1">
              Room: <span className="text-white font-mono">{roomId}</span>
              {' '}&middot;{' '}
              Host: <span className="text-white">{hostDisplayName}</span>
              {' '}&middot;{' '}
              <span className={connected ? 'text-green-400' : 'text-red-400'}>
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className={`w-36 py-2 rounded text-sm text-center cursor-pointer transition-colors duration-200 ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-[#333] hover:bg-[#444] text-white'
              }`}
            >
              {copied ? 'Copied!' : 'Copy invite link'}
            </button>
            {isHost && (
              <button
                onClick={handleEndSession}
                className="px-4 py-2 bg-[#e50914] hover:bg-[#f40612] rounded text-white text-sm font-bold cursor-pointer"
              >
                End session
              </button>
            )}
          </div>
        </div>

        {!isHost && (
          <p className="text-[#737373] text-sm mb-4">
            You are a guest. Only the host can control playback.
          </p>
        )}

        <div className="bg-[#1a1a1a] rounded p-4">
          <h2 className="text-white text-sm font-bold mb-3">
            Participants ({members.length})
          </h2>
          {members.length === 0 ? (
            <p className="text-[#737373] text-sm">No participants yet...</p>
          ) : (
            <ul className="space-y-2">
              {members.map((m) => {
                const online = participants.some((p) => p.email === m.email);
                return (
                  <li key={m.email} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${online ? 'bg-green-400' : 'bg-red-500'}`} />
                    <span className={`text-sm ${online ? 'text-white' : 'text-[#737373]'}`}>
                      {m.displayName}
                    </span>
                    {m.email === hostEmail && (
                      <span className="text-[#e50914] text-xs font-bold">HOST</span>
                    )}
                    {m.email === currentEmail && (
                      <span className="text-[#737373] text-xs">(you)</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

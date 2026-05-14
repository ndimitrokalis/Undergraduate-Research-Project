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
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hostEmail, setHostEmail] = useState('');
  const [hostDisplayName, setHostDisplayName] = useState('');
  const [members, setMembers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [notification, setNotification] = useState('');
  const hasResumed = useRef(false);
  const notificationTimer = useRef(null);

  const token = useAuthStore((s) => s.token);
  const currentEmail = token ? parseJwtSub(token) : '';
  const isHost = currentEmail !== '' && currentEmail === hostEmail;

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

    ignoreNextEvent.current = true;

    if (data.timestamp != null && playerRef.current) {
      playerRef.current.currentTime = parseFloat(data.timestamp);
    }

    if (data.type === 'PLAY') {
      setPlaying(true);
    } else if (data.type === 'PAUSE') {
      setPlaying(false);
    } else if (data.type === 'SEEK') {
      // seek already handled above
    } else if (data.type === 'SYNC') {
      setPlaying(data.playing === true);
      if (data.newHostEmail) {
        setHostEmail(data.newHostEmail);
      }
      if (data.participants) setParticipants(data.participants);
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
    return playerRef.current?.currentTime || 0;
  }

  function handlePlay() {
    if (ignoreNextEvent.current) return;
    if (!isHost) {
      setPlaying(false);
      return;
    }
    sendMessage('play', getCurrentTime());
  }

  function handlePause() {
    if (ignoreNextEvent.current) return;
    if (!isHost) {
      setPlaying(true);
      return;
    }
    sendMessage('pause', getCurrentTime());
  }

  function handleSeek(seconds) {
    if (ignoreNextEvent.current) return;
    if (!isHost) return;
    sendMessage('seek', seconds);
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
        <div className="relative aspect-video bg-black rounded overflow-hidden mb-4">
          <ReactPlayer
            ref={playerRef}
            src={streamUrl}
            width="100%"
            height="100%"
            playing={playing}
            controls
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
            onLoadedMetadata={(e) => {
              if (!hasResumed.current && session.playbackTimestamp > 0) {
                e.target.currentTime = session.playbackTimestamp;
                hasResumed.current = true;
              }
            }}
          />

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

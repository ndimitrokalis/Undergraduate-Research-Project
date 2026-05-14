import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resendVerification } from '../api/api';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [message, setMessage] = useState({ text: '', type: '' });
  const [remaining, setRemaining] = useState(30);
  const [sending, setSending] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    startCountdown(30);
    return () => clearInterval(intervalRef.current);
  }, []);

  function startCountdown(seconds) {
    setRemaining(seconds);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (!email) {
      setMessage({ text: 'No email address found. Please register again.', type: 'error' });
      return;
    }

    setSending(true);
    setMessage({ text: '', type: '' });

    try {
      const data = await resendVerification(email);
      setMessage({ text: data.message || 'Verification email sent!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to resend email.', type: 'error' });
    } finally {
      setSending(false);
      startCountdown(30);
    }
  }

  const disabled = remaining > 0 || sending;

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="w-full max-w-[450px] bg-black/75 rounded-lg p-[60px_68px_40px] text-center">
        <div className="text-[28px] font-black text-[#e50914] tracking-tight mb-2">Streaming-Platform</div>
        <div className="text-[64px] my-6">&#9993;</div>
        <h1 className="text-white text-[28px] font-bold mb-4">Check your email</h1>
        <p className="text-[#b3b3b3] text-base mb-2">
          We've sent a verification link to <strong className="text-white">{email || 'your email'}</strong>
        </p>
        <p className="text-[#737373] text-sm mb-8 leading-relaxed">
          Click the link in your email to activate your account. The link expires in 24 hours.
        </p>

        {message.text && (
          <div className={`rounded p-3 mb-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-900/20 border border-green-700 text-green-400'
              : 'bg-red-900/20 border border-[#e50914] text-[#e87c03]'
          }`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={disabled}
          className="w-full p-4 bg-[#e50914] hover:bg-[#f40612] disabled:bg-[#6d6d6d] disabled:cursor-not-allowed rounded text-white text-base font-bold cursor-pointer"
        >
          {sending ? 'Sending...' : remaining > 0 ? `Resend email (${remaining}s)` : 'Resend email'}
        </button>

        <p className="mt-4 text-sm text-[#737373]">
          Wrong email? <Link to="/register" className="text-white hover:underline">Sign up again</Link>
        </p>
        <p className="mt-4 text-sm text-[#737373]">
          Already verified? <Link to="/login" className="text-white hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

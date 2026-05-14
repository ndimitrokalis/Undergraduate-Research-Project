import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(email.trim());
      setSuccess(data.message);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="w-full max-w-112.5 bg-black/75 rounded-lg p-[60px_68px_40px]">
        <div className="text-[28px] font-black text-[#e50914] tracking-tight mb-2">Streaming-Platform</div>
        <h1 className="text-white text-[32px] font-bold mb-3">Forgot Password</h1>
        <p className="text-[#8c8c8c] text-sm mb-7">Enter your email and we'll send you a link to reset your password.</p>

        {error && (
          <div className="bg-red-900/20 border border-[#e50914] text-[#e87c03] rounded p-3 mb-4 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-900/20 border border-green-700 text-green-400 rounded p-3 mb-4 text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-[#333] border border-transparent rounded text-white text-base outline-none focus:border-[#e50914] focus:bg-[#454545] placeholder-[#8c8c8c]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-[#e50914] hover:bg-[#f40612] disabled:bg-[#6d6d6d] disabled:cursor-not-allowed rounded text-white text-base font-bold cursor-pointer mt-2"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-4 text-base text-[#737373]">
          <Link to="/login" className="text-white hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}

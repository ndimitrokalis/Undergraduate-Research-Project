import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate('/login?reset=true');
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
        <h1 className="text-white text-[32px] font-bold mb-7">Reset Password</h1>

        {error && (
          <div className="bg-red-900/20 border border-[#e50914] text-[#e87c03] rounded p-3 mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-[#333] border border-transparent rounded text-white text-base outline-none focus:border-[#e50914] focus:bg-[#454545] placeholder-[#8c8c8c]"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 bg-[#333] border border-transparent rounded text-white text-base outline-none focus:border-[#e50914] focus:bg-[#454545] placeholder-[#8c8c8c]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-[#e50914] hover:bg-[#f40612] disabled:bg-[#6d6d6d] disabled:cursor-not-allowed rounded text-white text-base font-bold cursor-pointer mt-2"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-4 text-base text-[#737373]">
          <Link to="/login" className="text-white hover:underline">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}

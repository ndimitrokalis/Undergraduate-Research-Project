import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../api/api';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const [searchParams] = useSearchParams();

  const verified = searchParams.get('verified') === 'true';
  const reset = searchParams.get('reset') === 'true';
  const errorParam = searchParams.get('error');

  function validate() {
    const errors = {};
    if (!identifier.trim()) errors.identifier = 'Email or phone number is required';
    if (!password) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login(identifier.trim(), password);
      setToken(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email/phone or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="w-full max-w-112.5 bg-black/75 rounded-lg p-[60px_68px_40px]">
        <div className="text-[28px] font-black text-[#e50914] tracking-tight mb-2">Streaming-Platform</div>
        <h1 className="text-white text-[32px] font-bold mb-7">Sign In</h1>

        {verified && (
          <div className="bg-green-900/20 border border-green-700 text-green-400 rounded p-3 mb-4 text-sm">Email verified successfully! You can now sign in.</div>
        )}
        {reset && (
          <div className="bg-green-900/20 border border-green-700 text-green-400 rounded p-3 mb-4 text-sm">Password reset successfully! You can now sign in.</div>
        )}
        {(error || errorParam) && (
          <div className="bg-red-900/20 border border-[#e50914] text-[#e87c03] rounded p-3 mb-4 text-sm">{error || errorParam}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Email or phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-4 bg-[#333] border border-transparent rounded text-white text-base outline-none focus:border-[#e50914] focus:bg-[#454545] placeholder-[#8c8c8c]"
            />
            {fieldErrors.identifier && <p className="text-[#e87c03] text-[13px] mt-1.5">{fieldErrors.identifier}</p>}
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-[#333] border border-transparent rounded text-white text-base outline-none focus:border-[#e50914] focus:bg-[#454545] placeholder-[#8c8c8c]"
            />
            {fieldErrors.password && <p className="text-[#e87c03] text-[13px] mt-1.5">{fieldErrors.password}</p>}
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-[#737373] text-sm hover:underline">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-[#e50914] hover:bg-[#f40612] disabled:bg-[#6d6d6d] disabled:cursor-not-allowed rounded text-white text-base font-bold cursor-pointer mt-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-base text-[#737373]">
          New to Streaming Platform? <Link to="/register" className="text-white hover:underline">Sign up now</Link>
        </p>
      </div>
    </div>
  );
}

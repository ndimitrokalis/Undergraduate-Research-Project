import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import { PHONE_CODES, COUNTRIES } from '../data/constants';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '', displayName: '', email: '', password: '', confirmPassword: '',
    phoneCode: '', phone: '', country: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  function validate() {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = 'Full name is required';
    if (!form.displayName.trim()) errors.displayName = 'Display name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Please enter a valid email';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!form.phoneCode || !form.phone.trim()) errors.phone = 'Phone code and number are required';
    if (!form.country) errors.country = 'Country is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phoneCode + ' ' + form.phone.trim(),
        country: form.country,
      });
      navigate('/verify-email?email=' + encodeURIComponent(form.email.trim()));
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full p-4 bg-[#333] border border-transparent rounded text-white text-base outline-none focus:border-[#e50914] focus:bg-[#454545] placeholder-[#8c8c8c]";
  const selectClass = "w-full p-4 bg-[#333] border border-transparent rounded text-white text-base outline-none focus:border-[#e50914] focus:bg-[#454545] appearance-none cursor-pointer";

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center py-10">
      <div className="w-full max-w-[450px] bg-black/75 rounded-lg p-[60px_68px_40px]">
        <div className="text-[28px] font-black text-[#e50914] tracking-tight mb-2">Streaming-Platform</div>
        <h1 className="text-white text-[32px] font-bold mb-7">Sign Up</h1>

        {error && (
          <div className="bg-red-900/20 border border-[#e50914] text-[#e87c03] rounded p-3 mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Field error={fieldErrors.fullName}>
            <input type="text" placeholder="Full Name" value={form.fullName} onChange={update('fullName')} className={inputClass} />
          </Field>

          <Field error={fieldErrors.displayName}>
            <input type="text" placeholder="Display Name" value={form.displayName} onChange={update('displayName')} className={inputClass} />
          </Field>

          <Field error={fieldErrors.email}>
            <input type="email" placeholder="Email address" value={form.email} onChange={update('email')} className={inputClass} />
          </Field>

          <Field error={fieldErrors.password}>
            <input type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={update('password')} className={inputClass} />
          </Field>

          <Field error={fieldErrors.confirmPassword}>
            <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={update('confirmPassword')} className={inputClass} />
          </Field>

          <Field error={fieldErrors.phone} label="Phone">
            <div className="flex gap-2">
              <select value={form.phoneCode} onChange={update('phoneCode')} className={selectClass + ' !w-[130px] shrink-0 text-sm'}>
                <option value="" disabled>Code</option>
                {PHONE_CODES.map((c) => <option key={c.code} value={c.code}>{c.code} ({c.country})</option>)}
              </select>
              <input type="tel" placeholder="Phone number" value={form.phone} onChange={update('phone')} className={inputClass} />
            </div>
          </Field>

          <Field error={fieldErrors.country} label="Country">
            <select value={form.country} onChange={update('country')} className={selectClass}>
              <option value="" disabled>Select your country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-[#e50914] hover:bg-[#f40612] disabled:bg-[#6d6d6d] disabled:cursor-not-allowed rounded text-white text-base font-bold cursor-pointer mt-6"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-base text-[#737373]">
          Already have an account? <Link to="/login" className="text-white hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ children, error, label }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm text-[#8c8c8c] mb-1.5">{label}</label>}
      {children}
      {error && <p className="text-[#e87c03] text-[13px] mt-1.5">{error}</p>}
    </div>
  );
}

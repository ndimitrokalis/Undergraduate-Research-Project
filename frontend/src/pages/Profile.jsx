import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, updateProfile, changePassword, getWatchHistory } from '../api/api';
import Navbar from '../components/Navbar';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName: '', phone: '', country: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    Promise.all([getProfile(), getWatchHistory()])
      .then(([profileData, historyData]) => {
        setProfile(profileData);
        setHistory(historyData);
        setForm({
          displayName: profileData.displayName || '',
          phone: profileData.phone || '',
          country: profileData.country || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      await updateProfile(form);
      setProfile({ ...profile, ...form });
      setEditing(false);
      setMessage({ text: 'Profile updated!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ text: 'Password changed successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to change password', type: 'error' });
    } finally {
      setSavingPassword(false);
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

  const inputClass = "w-full px-4 py-3 bg-[#333] border border-transparent rounded text-white text-base outline-none focus:border-[#e50914] placeholder-[#8c8c8c]";

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />

      <main className="max-w-175 mx-auto px-4 py-8">
        <h1 className="text-white text-[28px] font-bold mb-6">Profile</h1>

        {message.text && (
          <div className={`rounded p-3 mb-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-900/20 border border-green-700 text-green-400'
              : 'bg-red-900/20 border border-[#e50914] text-[#e87c03]'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
          {editing ? (
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-sm text-[#8c8c8c] mb-1.5">Display Name</label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-[#8c8c8c] mb-1.5">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-[#8c8c8c] mb-1.5">Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-[#e50914] hover:bg-[#f40612] disabled:bg-[#6d6d6d] rounded text-white text-sm font-bold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 bg-[#333] hover:bg-[#444] rounded text-white text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="space-y-3">
                <ProfileField label="Full Name" value={profile?.fullName} />
                <ProfileField label="Display Name" value={profile?.displayName} />
                <ProfileField label="Email" value={profile?.email} />
                <ProfileField label="Phone" value={profile?.phone} />
                <ProfileField label="Country" value={profile?.country} />
                <ProfileField label="Subscription" value={profile?.subscriptionType} />
                <ProfileField label="Member since" value={profile?.createdAt?.split('T')[0]} />
              </div>
              <button
                onClick={() => setEditing(true)}
                className="mt-6 px-6 py-3 bg-[#333] hover:bg-[#444] rounded text-white text-sm font-bold cursor-pointer"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>

        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
          {changingPassword ? (
            <form onSubmit={handleChangePassword}>
              <h2 className="text-white text-lg font-bold mb-4">Change Password</h2>
              <div className="mb-4">
                <label className="block text-sm text-[#8c8c8c] mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-[#8c8c8c] mb-1.5">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={inputClass}
                  required
                  minLength={8}
                />
                <p className="text-[#737373] text-xs mt-1">Min 8 characters, with uppercase, lowercase, digit, and special character</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-[#8c8c8c] mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={inputClass}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-6 py-3 bg-[#e50914] hover:bg-[#f40612] disabled:bg-[#6d6d6d] rounded text-white text-sm font-bold cursor-pointer"
                >
                  {savingPassword ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setChangingPassword(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                  className="px-6 py-3 bg-[#333] hover:bg-[#444] rounded text-white text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setChangingPassword(true)}
              className="px-6 py-3 bg-[#333] hover:bg-[#444] rounded text-white text-sm font-bold cursor-pointer"
            >
              Change Password
            </button>
          )}
        </div>

        <h2 className="text-white text-xl font-bold mb-4">Watch History</h2>
        {history.length === 0 ? (
          <p className="text-[#737373] text-sm">No watch history yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <Link
                to={'/watch/' + item.mediaId}
                key={i}
                className="flex items-center justify-between bg-[#1a1a1a] rounded-lg p-4 no-underline hover:bg-[#222]"
              >
                <div>
                  <p className="text-white font-bold">{item.mediaTitle || 'Media #' + item.mediaId}</p>
                  <p className="text-[#737373] text-sm mt-1">
                    Progress: {formatTime(item.progressSeconds || 0)}
                    {item.completed && <span className="text-green-400 ml-2">Completed</span>}
                  </p>
                </div>
                <span className="text-[#737373] text-sm">{item.lastWatchedAt?.split('T')[0]}</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="text-[#737373] text-sm w-35 shrink-0">{label}</span>
      <span className="text-white text-sm">{value || '—'}</span>
    </div>
  );
}

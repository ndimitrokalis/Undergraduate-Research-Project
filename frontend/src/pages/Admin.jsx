import { useState, useEffect } from 'react';
import {
  getAdminUsers, deleteAdminUser, updateAdminUserRole,
  getAdminMedia, createAdminMedia, updateAdminMedia, deleteAdminMedia,
} from '../api/api';
import Navbar from '../components/Navbar';

const inputClass = "w-full px-4 py-3 bg-[#333] border border-transparent rounded text-white text-base outline-none focus:border-[#e50914] placeholder-[#8c8c8c]";

const emptyMedia = {
  title: '', description: '', genre: '', type: 'MOVIE',
  thumbnailUrl: '', videoUrl: '', durationSeconds: '', releaseYear: '',
};

export default function Admin() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingMedia, setEditingMedia] = useState(null);
  const [mediaForm, setMediaForm] = useState(emptyMedia);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [u, m] = await Promise.all([getAdminUsers(), getAdminMedia()]);
      setUsers(u);
      setMedia(m);
    } catch (err) {
      setMessage({ text: err.message || 'Failed to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function flash(text, type) {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  }

  async function handleDeleteUser(user) {
    if (!confirm('Delete user ' + user.email + '?')) return;
    try {
      await deleteAdminUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      flash('User deleted', 'success');
    } catch (err) {
      flash(err.message || 'Failed to delete user', 'error');
    }
  }

  async function handleToggleRole(user) {
    const newAdmin = !user.admin;
    try {
      await updateAdminUserRole(user.id, newAdmin);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, admin: newAdmin } : u));
      flash('Role updated', 'success');
    } catch (err) {
      flash(err.message || 'Failed to update role', 'error');
    }
  }

  function openAddMedia() {
    setEditingMedia('new');
    setMediaForm(emptyMedia);
  }

  function openEditMedia(item) {
    setEditingMedia(item.id);
    setMediaForm({
      title: item.title || '',
      description: item.description || '',
      genre: item.genre || '',
      type: item.type || 'MOVIE',
      thumbnailUrl: item.thumbnailUrl || '',
      videoUrl: item.videoUrl || '',
      durationSeconds: item.durationSeconds || '',
      releaseYear: item.releaseYear || '',
    });
  }

  async function handleSaveMedia(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...mediaForm,
      durationSeconds: mediaForm.durationSeconds ? Number(mediaForm.durationSeconds) : null,
      releaseYear: mediaForm.releaseYear ? Number(mediaForm.releaseYear) : null,
    };

    try {
      if (editingMedia === 'new') {
        const created = await createAdminMedia(payload);
        setMedia((prev) => [...prev, created]);
        flash('Media created', 'success');
      } else {
        const updated = await updateAdminMedia(editingMedia, payload);
        setMedia((prev) => prev.map((m) => m.id === editingMedia ? updated : m));
        flash('Media updated', 'success');
      }
      setEditingMedia(null);
    } catch (err) {
      flash(err.message || 'Failed to save media', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMedia(item) {
    if (!confirm('Delete "' + item.title + '"?')) return;
    try {
      await deleteAdminMedia(item.id);
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
      flash('Media deleted', 'success');
    } catch (err) {
      flash(err.message || 'Failed to delete media', 'error');
    }
  }

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

      <main className="max-w-300 mx-auto px-4 py-8">
        <h1 className="text-white text-[28px] font-bold mb-6">Admin Dashboard</h1>

        {message.text && (
          <div className={`rounded p-3 mb-4 text-sm ${
            message.type === 'success'
              ? 'bg-green-900/20 border border-green-700 text-green-400'
              : 'bg-red-900/20 border border-[#e50914] text-[#e87c03]'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex gap-6 mb-6 border-b border-[#333]">
          <button
            onClick={() => setTab('users')}
            className={`pb-3 text-sm font-bold cursor-pointer ${
              tab === 'users'
                ? 'text-white border-b-2 border-[#e50914]'
                : 'text-[#737373] hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setTab('media')}
            className={`pb-3 text-sm font-bold cursor-pointer ${
              tab === 'media'
                ? 'text-white border-b-2 border-[#e50914]'
                : 'text-[#737373] hover:text-white'
            }`}
          >
            Media ({media.length})
          </button>
        </div>

        {tab === 'users' && (
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[#333] text-[#737373]">
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Display Name</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Verified</th>
                    <th className="px-4 py-3 font-medium">Subscription</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-[#333]/50 text-white">
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.displayName}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          user.admin ? 'bg-[#e50914]/20 text-[#e50914]' : 'bg-[#333] text-[#737373]'
                        }`}>
                          {user.admin ? 'ADMIN' : 'USER'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={user.enabled ? 'text-green-400' : 'text-red-400'}>
                          {user.enabled ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{user.subscriptionType}</td>
                      <td className="px-4 py-3 text-[#737373]">{user.createdAt?.split('T')[0]}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleRole(user)}
                            className="px-3 py-1 bg-[#333] hover:bg-[#444] rounded text-xs text-white cursor-pointer"
                          >
                            {user.admin ? 'Revoke admin' : 'Make admin'}
                          </button>
                          {!user.admin && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded text-xs text-red-400 cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'media' && (
          <>
            {editingMedia !== null ? (
              <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
                <h2 className="text-white text-lg font-bold mb-4">
                  {editingMedia === 'new' ? 'Add Media' : 'Edit Media'}
                </h2>
                <form onSubmit={handleSaveMedia}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-[#8c8c8c] mb-1.5">Title</label>
                      <input
                        type="text"
                        value={mediaForm.title}
                        onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#8c8c8c] mb-1.5">Genre</label>
                      <input
                        type="text"
                        value={mediaForm.genre}
                        onChange={(e) => setMediaForm({ ...mediaForm, genre: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#8c8c8c] mb-1.5">Type</label>
                      <select
                        value={mediaForm.type}
                        onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value })}
                        className={inputClass}
                      >
                        <option value="MOVIE">Movie</option>
                        <option value="SERIES">Series</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#8c8c8c] mb-1.5">Release Year</label>
                      <input
                        type="number"
                        value={mediaForm.releaseYear}
                        onChange={(e) => setMediaForm({ ...mediaForm, releaseYear: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#8c8c8c] mb-1.5">Duration (seconds)</label>
                      <input
                        type="number"
                        value={mediaForm.durationSeconds}
                        onChange={(e) => setMediaForm({ ...mediaForm, durationSeconds: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#8c8c8c] mb-1.5">Thumbnail URL</label>
                      <input
                        type="text"
                        value={mediaForm.thumbnailUrl}
                        onChange={(e) => setMediaForm({ ...mediaForm, thumbnailUrl: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-[#8c8c8c] mb-1.5">Video URL</label>
                    <input
                      type="text"
                      value={mediaForm.videoUrl}
                      onChange={(e) => setMediaForm({ ...mediaForm, videoUrl: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-[#8c8c8c] mb-1.5">Description</label>
                    <textarea
                      value={mediaForm.description}
                      onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
                      className={inputClass + ' h-24 resize-none'}
                      maxLength={1000}
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
                      onClick={() => setEditingMedia(null)}
                      className="px-6 py-3 bg-[#333] hover:bg-[#444] rounded text-white text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={openAddMedia}
                className="mb-6 px-6 py-3 bg-[#e50914] hover:bg-[#f40612] rounded text-white text-sm font-bold cursor-pointer"
              >
                Add Media
              </button>
            )}

            <div className="bg-[#1a1a1a] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-[#333] text-[#737373]">
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Genre</th>
                      <th className="px-4 py-3 font-medium">Year</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {media.map((item) => (
                      <tr key={item.id} className="border-b border-[#333]/50 text-white">
                        <td className="px-4 py-3">{item.title}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold px-2 py-1 rounded bg-[#333] text-[#737373]">
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">{item.genre}</td>
                        <td className="px-4 py-3 text-[#737373]">{item.releaseYear || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditMedia(item)}
                              className="px-3 py-1 bg-[#333] hover:bg-[#444] rounded text-xs text-white cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMedia(item)}
                              className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded text-xs text-red-400 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const response = await fetch(API_BASE + endpoint, { ...options, headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export function login(identifier, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

export function register(userData) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export function resendVerification(email) {
  return request('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function forgotPassword(email) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token, password) {
  return request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export function getProfile() {
  return request('/users/me');
}

export function updateProfile(updates) {
  return request('/users/me', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export function changePassword(currentPassword, newPassword) {
  return request('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function getAllMedia() {
  return request('/media');
}

export function getMediaById(id) {
  return request('/media/' + id);
}

export function searchMedia(title) {
  return request('/media/search?title=' + encodeURIComponent(title));
}

export function getMediaByGenre(genre) {
  return request('/media/genre/' + encodeURIComponent(genre));
}

export function getMediaByType(type) {
  return request('/media/type/' + encodeURIComponent(type));
}

export function getWatchHistory() {
  return request('/users/me/history');
}

export function getStreamInfo(mediaId) {
  return request('/stream/' + mediaId);
}

export function saveProgress(mediaId, progressSeconds, completed) {
  return request('/stream/' + mediaId + '/progress', {
    method: 'POST',
    body: JSON.stringify({ progressSeconds, completed }),
  });
}

export function saveProgressTick(mediaId, progressSeconds) {
  return request('/stream/' + mediaId + '/progress/tick', {
    method: 'POST',
    body: JSON.stringify({ progressSeconds }),
  });
}

export function getFavorites() {
  return request('/users/me/favorites');
}

export function addToFavorites(mediaId) {
  return request('/users/me/favorites/' + mediaId, { method: 'POST' });
}

export function removeFromFavorites(mediaId) {
  return request('/users/me/favorites/' + mediaId, { method: 'DELETE' });
}

export function isFavorite(mediaId) {
  return request('/users/me/favorites/' + mediaId);
}

export function createSession(mediaId) {
  return request('/sessions', {
    method: 'POST',
    body: JSON.stringify({ mediaId }),
  });
}

export function joinSession(roomId) {
  return request('/sessions/' + roomId + '/join', { method: 'POST' });
}

export function getSession(roomId) {
  return request('/sessions/' + roomId);
}

export function getActiveSessions() {
  return request('/sessions');
}

export function endSession(roomId) {
  return request('/sessions/' + roomId, { method: 'DELETE' });
}

export function getAdminUsers() {
  return request('/admin/users');
}

export function deleteAdminUser(id) {
  return request('/admin/users/' + id, { method: 'DELETE' });
}

export function updateAdminUserRole(id, admin) {
  return request('/admin/users/' + id + '/role', {
    method: 'PUT',
    body: JSON.stringify({ admin }),
  });
}

export function getAdminMedia() {
  return request('/admin/media');
}

export function createAdminMedia(data) {
  return request('/admin/media', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateAdminMedia(id, data) {
  return request('/admin/media/' + id, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteAdminMedia(id) {
  return request('/admin/media/' + id, { method: 'DELETE' });
}

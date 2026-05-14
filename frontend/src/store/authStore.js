import { create } from 'zustand';

function parseJwtRole(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'ADMIN';
  } catch {
    return false;
  }
}

const storedToken = localStorage.getItem('token');

const useAuthStore = create((set) => ({
  token: storedToken,
  isAuthenticated: !!storedToken,
  isAdmin: storedToken ? parseJwtRole(storedToken) : false,

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true, isAdmin: parseJwtRole(token) });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false, isAdmin: false });
  },
}));

export default useAuthStore;

import useAuthStore from '../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, isAuthenticated: false });
  });

  it('should start unauthenticated when no token in localStorage', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });

  it('should set token and mark as authenticated', () => {
    useAuthStore.getState().setToken('test-jwt');

    const state = useAuthStore.getState();
    expect(state.token).toBe('test-jwt');
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe('test-jwt');
  });

  it('should clear token and mark as unauthenticated on logout', () => {
    useAuthStore.getState().setToken('test-jwt');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});

import { login, register, forgotPassword, resetPassword, getAllMedia, getMediaByType, searchMedia } from '../api/api';

describe('API functions', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  function mockFetch(data, ok = true) {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok,
        json: () => Promise.resolve(data),
      })
    );
  }

  it('login should POST identifier and password', async () => {
    mockFetch({ token: 'jwt-123' });

    const result = await login('test@example.com', 'password');

    expect(result.token).toBe('jwt-123');
    expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ identifier: 'test@example.com', password: 'password' }),
    }));
  });

  it('login should throw on error response', async () => {
    mockFetch({ message: 'Invalid credentials' }, false);

    await expect(login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
  });

  it('register should POST user data', async () => {
    mockFetch({ message: 'Registration successful' });

    const userData = { email: 'new@example.com', password: 'pass123', displayName: 'New' };
    const result = await register(userData);

    expect(result.message).toContain('Registration successful');
    expect(fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(userData),
    }));
  });

  it('forgotPassword should POST email', async () => {
    mockFetch({ message: 'Reset link sent' });

    const result = await forgotPassword('test@example.com');

    expect(result.message).toContain('Reset link sent');
    expect(fetch).toHaveBeenCalledWith('/api/auth/forgot-password', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    }));
  });

  it('resetPassword should POST token and password', async () => {
    mockFetch({ message: 'Password reset successfully' });

    const result = await resetPassword('reset-token', 'newpass');

    expect(result.message).toContain('Password reset');
    expect(fetch).toHaveBeenCalledWith('/api/auth/reset-password', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ token: 'reset-token', password: 'newpass' }),
    }));
  });

  it('getAllMedia should GET all media', async () => {
    const media = [{ id: 1, title: 'Test' }];
    mockFetch(media);

    const result = await getAllMedia();

    expect(result).toEqual(media);
    expect(fetch).toHaveBeenCalledWith('/api/media', expect.objectContaining({ headers: expect.any(Object) }));
  });

  it('getMediaByType should GET with type parameter', async () => {
    mockFetch([{ id: 1, title: 'Movie', type: 'MOVIE' }]);

    const result = await getMediaByType('MOVIE');

    expect(result[0].type).toBe('MOVIE');
    expect(fetch).toHaveBeenCalledWith('/api/media/type/MOVIE', expect.any(Object));
  });

  it('searchMedia should encode title parameter', async () => {
    mockFetch([]);

    await searchMedia('dark horizon');

    expect(fetch).toHaveBeenCalledWith('/api/media/search?title=dark%20horizon', expect.any(Object));
  });

  it('should include auth header when token exists', async () => {
    localStorage.setItem('token', 'my-jwt');
    mockFetch([]);

    await getAllMedia();

    const call = fetch.mock.calls[0];
    expect(call[1].headers['Authorization']).toBe('Bearer my-jwt');
  });
});

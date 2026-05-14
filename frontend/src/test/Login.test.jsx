import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

jest.mock('../api/api', () => ({
  login: jest.fn(),
}));

jest.mock('../store/authStore', () => ({
  __esModule: true,
  default: (selector) => {
    const state = { setToken: jest.fn(), isAuthenticated: false };
    return selector(state);
  },
}));

function renderLogin(route = '/login') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Login />
    </MemoryRouter>
  );
}

describe('Login page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render sign in form', () => {
    renderLogin();

    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email or phone number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should show validation errors when fields are empty', () => {
    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.getByText('Email or phone number is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('should show forgot password link', () => {
    renderLogin();

    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
  });

  it('should show sign up link', () => {
    renderLogin();

    expect(screen.getByText('Sign up now')).toBeInTheDocument();
  });

  it('should show verified banner when query param is set', () => {
    renderLogin('/login?verified=true');

    expect(screen.getByText(/Email verified successfully/)).toBeInTheDocument();
  });

  it('should show reset banner when query param is set', () => {
    renderLogin('/login?reset=true');

    expect(screen.getByText(/Password reset successfully/)).toBeInTheDocument();
  });

  it('should show error banner when error query param is set', () => {
    renderLogin('/login?error=Token%20expired');

    expect(screen.getByText('Token expired')).toBeInTheDocument();
  });

  it('should call login API on valid submission', async () => {
    const { login } = await import('../api/api');
    login.mockResolvedValue({ token: 'jwt-token' });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Email or phone number'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});

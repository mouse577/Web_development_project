import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../utils/Auth';
import usePostRequest from '../../hooks/usePostRequest';
import { AuthUserData } from '../../types';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';


// TO DO: This is just a quick and dirty login, add style and such
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUserData | null>(null);
  const navigate = useNavigate();
  const { sendRequest, loading } = usePostRequest<{ token: string }>('login');
  

  // Check if user is already logged in
  useEffect(() => {
    const loggedInUser = AuthService.getUser();
    console.log('Retrieved User:', loggedInUser);
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

  // Handle login form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Send login request
    const response = await sendRequest({ email, password });

    if (response && response.token) {
      console.log('Received Token:', response.token);

      // Store token and update user state
      AuthService.login(response.token);
      setUser(AuthService.getUser());
      // Redirect to home
      navigate('/productivity-frontend');
    } else {
      setError('Invalid email or password');
    }
  };

  // Show user info if logged in
  if (user) {
    return (
      <div>
        <h2>
          Welcome, {user.first_name} {user.last_name}!
        </h2>
        <p>Email: {user.email}</p>
        <button
          onClick={() => {
            AuthService.logout();
            setUser(null);
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  // Show login form if user is NOT logged in
  return (
    <Container>
      <h2>Login</h2>

      {error && <p>{error}</p>}

      <Form onSubmit={handleSubmit} className='mb-2 p-2 bg-body-tertiary'>
        <Form.Label>
          Email:{' '}
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Label>
        <br />
        <Form.Label>
          Password:{' '}
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Label>
        <br />
        <button type='submit' className="btn btn-primary mb-1" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </Form>
      {/* Direct unregistered users to the signup page */}
      <h4>No account?</h4>
      <button type='button' className="btn btn-info mb-1" onClick={() => navigate('/signup')}>
        Sign up
      </button>
    </Container>
  );
};

export default LoginPage;
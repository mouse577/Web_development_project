import { useNavigate } from 'react-router-dom';
import AuthService from '../../utils/Auth';
import { useState } from 'react';
import usePostPutPatchDelete from '../../hooks/usePostPutPatchDelete';
import { UserInfo, SignupResponse } from '../../types';
import Form from 'react-bootstrap/Form';

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data, error, loading, sendRequest } = usePostPutPatchDelete<UserInfo, SignupResponse>(
    'signup',
    'POST',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const info: UserInfo = {
      username: username,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };
    sendRequest(info);
  };

  // The user should not be able to create a new account while currently logged in
  if (AuthService.loggedIn()) {
    return (
      <>
        <p>You're already logged in!</p>
        <button type='button' onClick={() => AuthService.logout()}>
          Log out
        </button>
        <button type='button' onClick={() => navigate('/productivity-frontend')}>
          Back home
        </button>
      </>
    );
  }

  // Show the sign up form if the user hasn't signed up yet
  if (!data) {
    return (
      <Form onSubmit={handleSubmit} className='mb-2 p-2 bg-body-tertiary'>
        <h2>Create a new account</h2>
        <Form.Label>
          First name:{' '}
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </Form.Label>
        <br />
        <Form.Label>
          Last name:{' '}
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </Form.Label>
        <br />
        <Form.Label>
          Username:{' '}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </Form.Label>
        <br />
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
        <button className="btn btn-primary mb-1" type='submit'>Sign up</button>
      </Form>
    );
  }

  // These return statements are reached after the user has clicked sign up
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error creating account: {error.message}</p>;
  return (
    <>
      <h3>Successfully created account</h3>
      <button className="btn btn-primary mb-1" type='button' onClick={() => navigate('/login')}>
        Log in
      </button>
    </>
  );
};

export default SignupPage;
import { useNavigate } from 'react-router-dom';
import AuthService from '../../utils/Auth';
import { AuthUserData, UserInfo, UserInfoField } from '../../types';
import { useEffect, useState } from 'react';
import InfoUpdateForm from './InfoUpdateForm';
import DeleteAccount from './DeleteAccount';
import Container from 'react-bootstrap/Container';


const AccountPage = () => {
  const [user, setUser] = useState<AuthUserData | UserInfo | null>(null);
  const [token, setToken] = useState('');
  const [updatingInfo, setUpdatingInfo] = useState<UserInfoField | null>(null);
  const navigate = useNavigate();

  // Try to get the user. If they are not logged in, redirect to the login page.
  useEffect(() => {
    const loggedInUser = AuthService.getUser();
    const retrievedToken = AuthService.getToken();
    if (loggedInUser && retrievedToken) {
      setUser(loggedInUser);
      setToken(retrievedToken);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    user && (
      <Container>
        <h2>Hello, {user.first_name}!</h2>
        <br />
        {updatingInfo ? (
          <InfoUpdateForm
            field={updatingInfo}
            setUpdatingInfo={setUpdatingInfo}
            token={token}
            setUser={setUser}
          />
        ) : (
          <Container>
            <button className="btn btn-secondary mb-1" type='button' onClick={() => setUpdatingInfo('username')}>
              Change username
            </button>
            <br />
            <button className="btn btn-secondary mb-1" type='button' onClick={() => setUpdatingInfo('first_name')}>
              Change first name
            </button>
            <br />
            <button className="btn btn-secondary mb-1" type='button' onClick={() => setUpdatingInfo('last_name')}>
              Change last name
            </button>
            <br />
            <button className="btn btn-secondary mb-1" type='button' onClick={() => setUpdatingInfo('email')}>
              Change email
            </button>
            <br />
            <button className="btn btn-secondary mb-1" type='button' onClick={() => setUpdatingInfo('password')}>
              Change password
            </button>
            <br />
            <button type='button' className="btn btn-primary mb-1" onClick={() => AuthService.logout()}>
              Log out
            </button>
            <br />
            <DeleteAccount token={token} />
          </Container>
        )}
      </Container>
    )
  );
};

export default AccountPage;
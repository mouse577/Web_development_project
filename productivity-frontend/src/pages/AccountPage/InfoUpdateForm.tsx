import { useEffect, useState } from 'react';
import usePostPutPatchDelete from '../../hooks/usePostPutPatchDelete';
import { AuthUserData, UserInfo, UserInfoField, UserUpdateResponse } from '../../types';
import AuthService from '../../utils/Auth';
import { useNavigate } from 'react-router-dom';

type InfoUpdateFormProps = {
  field: UserInfoField;
  setUpdatingInfo: (updatingInfo: UserInfoField | null) => void;
  token: string;
  setUser: (user: AuthUserData | UserInfo | null) => void;
};

const InfoUpdateForm: React.FC<InfoUpdateFormProps> = ({
  field,
  setUpdatingInfo,
  token,
  setUser,
}) => {
  const [newInfo, setNewInfo] = useState('');
  const navigate = useNavigate();
  const { data, error, loading, sendRequest } = usePostPutPatchDelete<
    Record<UserInfoField, string>,
    UserUpdateResponse
  >('user', 'PATCH', { Authorization: `Bearer ${token}` });

  // Automatically redirect or log out 2.5s after successful update
  useEffect(() => {
    if (data) {
      setUser(data.user);
      const timer = setTimeout(() => {
        // Log out for email or password change
        if (field === 'email' || field === 'password') AuthService.logout();
        // Update localStorage and redirect to home for username, first name, or last name change
        else AuthService.login(data.token);
      }, 2500);
      return () => clearTimeout(timer); // Cleanup in case the component unmounts early
    }
  }, [data, setUser, field, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Determining this is type safe because field is constrained to be a non-null UserInfoField
    sendRequest({ [field]: newInfo } as Record<UserInfoField, string>);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          New {field}:{' '}
          <input
            value={newInfo}
            onChange={(e) => setNewInfo(e.target.value)}
            type={field === 'email' || field === 'password' ? field : 'text'}
            required
            autoFocus
          />
        </label>
        <br />
        <button type='submit'>Submit</button>
        <button type='button' onClick={() => setUpdatingInfo(null)}>
          Cancel
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Failed to update info: {error.message}</p>}
      {data && <p>Successfully updated {field}, redirecting...</p>}
      <br />
    </>
  );
};

export default InfoUpdateForm;

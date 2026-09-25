import { useEffect, useState } from 'react';
import usePostPutPatchDelete from '../../hooks/usePostPutPatchDelete';
import AuthService from '../../utils/Auth';

const DeleteAccount: React.FC<{ token: string }> = ({ token }) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { data, error, loading, sendRequest } = usePostPutPatchDelete<
    undefined, // No body for DELETE
    { message: string }
  >('user', 'DELETE', { Authorization: `Bearer ${token}` });

  // Automatically redirect 2.5s after successful deletion
  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => AuthService.logout(), 2500);
      return () => clearTimeout(timer); // Cleanup in case the component unmounts early
    }
  }, [data]);

  return (
    <>
      <h3>DANGER ZONE</h3>
      <button type='button' className="btn btn-danger" onClick={() => setConfirmingDelete(true)}>
        Delete account
      </button>
      {confirmingDelete && (
        <>
          <p>
            <strong>Are you SURE you want to delete your account?</strong>
          </p>
          {/* No body for DELETE */}
          <button type='button' onClick={() => sendRequest(undefined)}>
            Yes, delete
          </button>
          <button type='button' onClick={() => setConfirmingDelete(false)}>
            No, cancel deletion
          </button>
        </>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Failed to delete account: {error.message}</p>}
      {data && <p>Successfully deleted account, redirecting...</p>}
    </>
  );
};

export default DeleteAccount;
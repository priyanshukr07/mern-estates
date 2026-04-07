import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !window.google || !googleButtonRef.current) return;

    const handleGoogleResponse = async (response) => {
      try {
        dispatch(signInStart());

        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: response.credential,
          }),
        });
        const data = await res.json();

        if (!res.ok || data.success === false) {
          dispatch(signInFailure(data.message || 'Google sign-in failed.'));
          return;
        }

        dispatch(signInSuccess(data));
        navigate('/');
      } catch (error) {
        dispatch(signInFailure(error.message));
      }
    };

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse,
    });

    googleButtonRef.current.innerHTML = '';

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      width: 320,
    });
  }, [clientId, dispatch, navigate]);

  if (!clientId) {
    return (
      <p className='text-sm text-red-600'>
        Google sign-in is unavailable until `VITE_GOOGLE_CLIENT_ID` is set.
      </p>
    );
  }

  return (
    <div className='flex justify-center'>
      <div ref={googleButtonRef} />
    </div>
  );
}

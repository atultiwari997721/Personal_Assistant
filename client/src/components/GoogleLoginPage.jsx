import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { setCredentials } from '../store/authSlice.js';
import api from '../services/api.js';

const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client';

export default function GoogleLoginPage() {
  const dispatch = useDispatch();
  const buttonRef = useRef(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      setStatus('Google sign-in is not configured. Set GOOGLE_CLIENT_ID on the server and VITE_GOOGLE_CLIENT_ID for the website.');
      return undefined;
    }

    let active = true;
    let script = document.querySelector(`script[src="${GOOGLE_SCRIPT}"]`);
    const render = () => {
      if (!active || !window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          if (!credential || !active) return;
          setBusy(true);
          setStatus('Verifying your Google account…');
          try {
            const response = await api.post('/auth/google-login', { idToken: credential });
            if (!response.data?.success || !response.data?.token || !response.data?.user) {
              throw new Error(response.data?.message || 'Google sign-in did not return a verified session.');
            }
            dispatch(setCredentials({ user: response.data.user, token: response.data.token }));
          } catch (error) {
            setStatus(error.response?.data?.message || error.message || 'Google sign-in failed.');
          } finally {
            setBusy(false);
          }
        },
      });
      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, { type: 'standard', theme: 'outline', size: 'large', text: 'signin_with', shape: 'pill', width: 280 });
    };

    if (!script) {
      script = document.createElement('script');
      script.src = GOOGLE_SCRIPT;
      script.async = true;
      script.defer = true;
      script.onload = render;
      script.onerror = () => active && setStatus('Could not load Google sign-in. Check your internet connection and content security policy.');
      document.head.appendChild(script);
    } else if (window.google?.accounts?.id) render();
    else script.addEventListener('load', render);

    return () => {
      active = false;
      script?.removeEventListener('load', render);
    };
  }, [clientId, dispatch]);

  return <main className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-dark-950 p-5">
    <section className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900 p-8 shadow-xl">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500"><Sparkles className="h-6 w-6 text-white" /></div>
      <h1 className="text-center text-2xl font-extrabold text-slate-900 dark:text-white">Sign in to KritiAI</h1>
      <p className="mt-2 text-center text-sm text-slate-500">Use your Google account. The server verifies the sign-in token before creating a session.</p>
      <div className="mt-6 flex justify-center" aria-busy={busy}><div ref={buttonRef} /></div>
      {busy && <p role="status" className="mt-3 text-center text-xs text-slate-500">Verifying account…</p>}
      {status && <p role="status" className="mt-4 text-center text-xs text-amber-600 dark:text-amber-300">{status}</p>}
      <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-500"><ShieldCheck className="h-3.5 w-3.5" />Only a verified Google identity can create a session.</p>
    </section>
  </main>;
}

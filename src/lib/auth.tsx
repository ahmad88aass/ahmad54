import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Profile } from './types';
import { supabase } from './supabase';

interface AuthState {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithFacebook: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  var loadProfile = useCallback(async function (uid: string) {
    var result = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
    if (result.data) {
      setProfile(result.data as Profile);
    } else {
      setProfile(null);
    }
  }, []);

  useEffect(function () {
    var init = async function () {
      var sessionResult = await supabase.auth.getSession();
      var session = sessionResult.data.session;
      if (session && session.user) {
        setUserId(session.user.id);
        var emailVal = session.user.email;
        if (!emailVal) { emailVal = ''; }
        setUserEmail(emailVal);
        await loadProfile(session.user.id);
      }
      setLoading(false);
    };
    init();

    var listener = supabase.auth.onAuthStateChange(function (_event, session) {
      if (session && session.user) {
        setUserId(session.user.id);
        var emailVal2 = session.user.email;
        if (!emailVal2) { emailVal2 = ''; }
        setUserEmail(emailVal2);
        loadProfile(session.user.id);
      } else {
        setUserId(null);
        setUserEmail(null);
        setProfile(null);
      }
    });

    return function () {
      listener.data.subscription.unsubscribe();
    };
  }, [loadProfile]);

  var signIn = useCallback(async function (email: string, password: string) {
    setError(null);
    var result = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    if (result.error) {
      var msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      setError(msg);
      return { error: msg };
    }
    return { error: null };
  }, []);

  var signUp = useCallback(async function (email: string, password: string) {
    setError(null);
    var result = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });
    if (result.error) {
      var msg = result.error.message;
      if (msg.indexOf('already registered') !== -1) {
        msg = 'هذا البريد مسجّل مسبقاً. سجّل الدخول بدلاً من ذلك.';
      }
      setError(msg);
      return { error: msg };
    }
    return { error: null };
  }, []);

  var signInWithGoogle = useCallback(async function () {
    setError(null);
    var result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://ahmad88aass.github.io/ahmad54/' },
    });
    if (result.error) {
      setError(result.error.message);
      return { error: result.error.message };
    }
    return { error: null };
  }, []);

  var signInWithFacebook = useCallback(async function () {
    setError(null);
    var result = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: 'https://ahmad88aass.github.io/ahmad54/' },
    });
    if (result.error) {
      setError(result.error.message);
      return { error: result.error.message };
    }
    return { error: null };
  }, []);var signOut = useCallback(async function () {
    await supabase.auth.signOut();
    setUserId(null);
    setUserEmail(null);
    setProfile(null);
  }, []);

  var refreshProfile = useCallback(async function () {
    if (!userId) return;
    await loadProfile(userId);
  }, [userId, loadProfile]);

  var value = useMemo<AuthState>(
    function () {
      var emailOut = userEmail;
      if (!emailOut) { emailOut = ''; }
      return {
        user: userId ? { id: userId, email: emailOut } : null,
        profile: profile,
        loading: loading,
        error: error,
        signIn: signIn,
        signUp: signUp,
        signInWithGoogle: signInWithGoogle,
        signInWithFacebook: signInWithFacebook,
        signOut: signOut,
        refreshProfile: refreshProfile,
      };
    },
    [userId, userEmail, profile, loading, error, signIn, signUp, signInWithGoogle, signInWithFacebook, signOut, refreshProfile],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  var ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

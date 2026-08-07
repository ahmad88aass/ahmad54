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
import {
  createUser,
  findUserByEmail,
  findUserById,
  getSession,
  setSession,
  toProfile,
} from './store';

interface AuthState {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sess = getSession();
    if (sess) {
      const u = findUserById(sess.userId);
      if (u) setProfile(toProfile(u));
      else setSession(null);
    }
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const u = findUserByEmail(email.trim());
    if (!u || u.password !== password) {
      const msg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      setError(msg);
      return { error: msg };
    }
    setSession(u.id);
    setProfile(toProfile(u));
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);
    const exists = findUserByEmail(email.trim());
    if (exists) {
      const msg = 'هذا البريد مسجّل مسبقاً. سجّل الدخول بدلاً من ذلك.';
      setError(msg);
      return { error: msg };
    }
    const u = createUser(email.trim(), password);
    setSession(u.id);
    setProfile(toProfile(u));
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    setSession(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!profile) return;
    const u = findUserById(profile.id);
    if (u) setProfile(toProfile(u));
  }, [profile]);

  const value = useMemo<AuthState>(
    () => ({
      user: profile ? { id: profile.id, email: profile.email } : null,
      profile,
      loading,
      error,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [profile, loading, error, signIn, signUp, signOut, refreshProfile],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

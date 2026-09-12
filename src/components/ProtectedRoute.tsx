import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Gamepad2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setHasSession(!!session);
          setChecking(false);
        }
      } catch (err) {
        if (isMounted) {
          setHasSession(false);
          setChecking(false);
        }
      }
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setHasSession(!!session);
        setChecking(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm animate-pulse">
          <Gamepad2 className="w-6 h-6" />
        </div>
        <div className="text-center">
          <div className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-200">
            Entering Realm...
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Verifying your active session
          </div>
        </div>
      </div>
    );
  }

  if (!hasSession) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setHasSession(!!session);
          setChecking(false);
        }
      } catch {
        if (isMounted) {
          setHasSession(false);
          setChecking(false);
        }
      }
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setHasSession(!!session);
        setChecking(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (checking) {
    return null;
  }

  if (hasSession) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};


import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from '@/types/auth.types';
import { useAuthFunctions } from '@/hooks/use-auth-functions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    loading,
    setLoading,
    session,
    setSession,
    user,
    setUser,
    fetchProfile,
    signUp,
    signIn,
    signOut,
    signOutAll,
    updateProfile,
    checkUsername
  } = useAuthFunctions();

  useEffect(() => {
    const getSession = async () => {
      try {
        console.log('Getting session...');
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Session data:', data?.session ? 'Session exists' : 'No session');
          setSession(data.session);
          if (data.session) {
            console.log('Fetching profile for user:', data.session.user.id);
            await fetchProfile(data.session.user.id);
          } else {
            console.log('No session found');
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Unexpected error getting session:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession ? 'Session exists' : 'No session');
        setSession(newSession);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession) {
            console.log('Fetching profile after auth state change for user:', newSession.user.id);
            // Add a short delay to allow database triggers to complete
            setTimeout(async () => {
              await fetchProfile(newSession.user.id);
            }, 500);
          }
        } else if (event === 'USER_UPDATED') {
          if (newSession) {
            console.log('User updated, refreshing profile for:', newSession.user.id);
            await fetchProfile(newSession.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        signOutAll,
        updateProfile,
        checkUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

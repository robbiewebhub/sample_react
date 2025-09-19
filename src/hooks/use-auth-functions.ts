
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/use-profile';
import { Profile } from '@/types/auth.types';

export function useAuthFunctions() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const { profile, fetchProfile, updateProfile: updateUserProfile, checkUsername } = useProfile();
  const { toast } = useToast();

  // Sync user state with profile when profile changes
  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile]);

  const signUp = async (email: string, password: string, fullName: string, username: string): Promise<void> => {
    try {
      setLoading(true);
      
      console.log('Starting sign up process for:', email);
      
      // First check if the username is available
      const isAvailable = await checkUsername(username);
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }
      
      // Ensure username is lowercase
      const lowerCaseUsername = username.toLowerCase();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: lowerCaseUsername,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up response:', data);
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast({
          title: 'Account created',
          description: 'Please check your email for confirmation',
        });
      } else if (data.session) {
        // If we have a session, the user is already confirmed (confirmation disabled)
        setSession(data.session);
        
        // Allow a short delay for the trigger to complete
        setTimeout(async () => {
          if (data.user) {
            await fetchProfile(data.user.id);
          }
        }, 500);
        
        toast({
          title: 'Account created',
          description: 'Your account has been created and you are now signed in!',
        });
      }
    } catch (error: any) {
      console.error('Error in sign up:', error);
      toast({
        title: 'Error signing up',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      console.log('Attempting to sign in:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful, session:', data.session?.user.id);
      
      // Set the session
      setSession(data.session);
      
      // Fetch user profile
      if (data.session) {
        await fetchProfile(data.session.user.id);
      }

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in',
      });
    } catch (error: any) {
      console.error('Error in sign in:', error);
      toast({
        title: 'Error signing in',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out user');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      // Clear the session and user state
      setSession(null);
      setUser(null);

      console.log('User signed out successfully');
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out',
      });
    } catch (error: any) {
      console.error('Error in sign out:', error);
      toast({
        title: 'Error signing out',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const signOutAll = async () => {
    try {
      setLoading(true);
      console.log('Signing out all sessions');
      
      // Call Supabase to sign out all sessions (this only signs out current user's sessions)
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Sign out all error:', error);
        throw error;
      }

      // Clear the session and user state
      setSession(null);
      setUser(null);

      console.log('All sessions signed out successfully');
      
      toast({
        title: 'Signed out',
        description: 'All users have been signed out',
      });
    } catch (error: any) {
      console.error('Error in sign out all:', error);
      toast({
        title: 'Error signing out all',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<Profile>): Promise<void> => {
    if (!session?.user.id) {
      console.error('Cannot update profile: No authenticated user');
      toast({
        title: 'Error updating profile',
        description: 'User not authenticated',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    try {
      console.log('Updating profile for user:', session.user.id);
      await updateUserProfile(profile, session.user.id);
      
      // Update local user state if profile update was successful
      if (user) {
        setUser({ ...user, ...profile });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Check, X, Loader2 } from 'lucide-react';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import AuthFooter from '@/components/AuthFooter';
import { useLanguage } from '@/contexts/LanguageContext';

const Auth = () => {
  const navigate = useNavigate();
  const { session, loading: authLoading, signIn, signUp, checkUsername } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      console.log('User is authenticated, redirecting to home');
      navigate('/');
    }
  }, [session, navigate]);

  // Debounced username availability check
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      const isAvailable = await checkUsername(username);
      setUsernameAvailable(isAvailable);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, checkUsername]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: t('fillAllFields'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
      // No need to navigate, the useEffect will handle this once session is set
    } catch (error: any) {
      console.error('Sign in error:', error);
      setAuthError(error.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (!email || !password || !fullName || !username) {
      toast({
        title: 'Error',
        description: t('fillAllFields'),
        variant: 'destructive',
      });
      return;
    }
    
    if (username.length < 3) {
      toast({
        title: 'Error',
        description: t('usernameLength'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!usernameAvailable) {
      toast({
        title: 'Error',
        description: t('usernameTaken'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signUp(email, password, fullName, username);
      console.log('Sign up process completed');
      // No need to navigate - either user will be redirected automatically if email verification is disabled,
      // or they'll need to check their email if verification is enabled
    } catch (error: any) {
      console.error('Sign up error:', error);
      setAuthError(error.message || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading && session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background px-4">
      {/* Animated Background Pattern */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={5}
        repeatDelay={0.5}
        className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-10%] h-[120%]"
      />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-fusion-primary to-fusion-accent bg-clip-text text-transparent">
            {t('appName')}
          </h1>
          <p className="text-gray-600 mt-2">{t('appTagline')}</p>
        </div>
        
        <Card className="border-none shadow-lg backdrop-blur-sm bg-white/80">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl font-bold text-center">{t('welcome')}</CardTitle>
            <CardDescription className="text-center">
              {t('signInOrCreate')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {authError}
              </div>
            )}
            
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 rounded-lg p-1 bg-muted/30">
                <TabsTrigger value="signin" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  {t('signIn')}
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  {t('createAccount')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder={t('email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder={t('password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-fusion-primary to-fusion-accent hover:opacity-90 transition-opacity text-white font-medium" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('signingIn')}
                      </>
                    ) : t('signIn')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="fullname"
                        placeholder={t('fullName')}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                      <Input
                        id="username"
                        placeholder={t('username')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`pl-10 ${
                          usernameAvailable === true 
                            ? 'border-green-500 focus-visible:ring-green-300'
                            : usernameAvailable === false
                              ? 'border-red-500 focus-visible:ring-red-300'
                              : ''
                        }`}
                        required
                      />
                      {username.length >= 3 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {usernameAvailable === true && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          {usernameAvailable === false && (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {username.length >= 3 && usernameAvailable !== null && (
                      <p className={`text-xs mt-1 ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {usernameAvailable ? t('usernameAvailable') : t('usernameTaken')}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={t('email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder={t('password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-fusion-primary to-fusion-accent hover:opacity-90 transition-opacity text-white font-medium" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('creatingAccount')}
                      </>
                    ) : t('createAccount')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Auth Footer */}
      <AuthFooter />
    </div>
  );
};

export default Auth;

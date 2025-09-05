
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { getAuth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { SaathiIcon } from '@/components/icons';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(true);

  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    let cancelled = false;
    const checkRedirect = async () => {
      try {
        const auth = getAuth();
        const result = await getRedirectResult(auth);
        // result will be non-null if a redirect sign-in just finished
      } catch (error: any) {
        toast({
          title: 'Google Sign-In Failed',
          description: error?.message ?? 'Unknown error',
          variant: 'destructive',
        });
      } finally {
        if (!cancelled) setIsRedirecting(false);
      }
    };

    checkRedirect();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const validate = (email: string, password: string) => {
    if (!email) {
      toast({ title: 'Missing email', description: 'Please enter an email address.', variant: 'destructive' });
      return false;
    }
    if (!password || password.length < 6) {
      toast({ title: 'Weak password', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setIsLoading(true);
    try {
      const auth = getAuth();

      if (action === 'signup') {
        if (!validate(signupEmail, signupPassword)) {
          setIsLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      } else {
        if (!validate(loginEmail, loginPassword)) {
          setIsLoading(false);
          return;
        }
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      }
      // useAuth will handle redirect when user state updates
    } catch (error: any) {
      toast({
        title: 'Authentication Failed',
        description: error?.message ?? 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setIsRedirecting(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
      // the redirect will leave the page — getRedirectResult handles the return
    } catch (error: any) {
      toast({
        title: 'Google Sign-In Failed',
        description: error?.message ?? 'Unknown error',
        variant: 'destructive',
      });
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="flex flex-col items-center justify-center space-y-4 p-8">
          <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Authenticating with Google...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4">
          <SaathiIcon className="h-16 w-16 text-primary" />
          <h1 className="text-4xl font-headline">Welcome to SaathiAI</h1>
          <p className="text-center text-muted-foreground">Your personal wellness companion. Sign in to continue your journey.</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
                <Button onClick={() => handleAuthAction('login')} className="w-full" disabled={isLoading}>
                  {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create an account to start your wellness journey.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                </div>
                <Button onClick={() => handleAuthAction('signup')} className="w-full" disabled={isLoading}>
                  {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-muted"></div>
            <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Or continue with</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isRedirecting}>
            {isLoading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> :
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 173.4 57.2l-67.4 67.4C309.8 99.4 280.6 84 248 84c-80.9 0-146.5 65.5-146.5 146.5S167.1 377 248 377c88.4 0 112.5-62.7 115.9-93.1H248v-61.9h238.5c1.3 8.3 2.5 16.8 2.5 25.8z"></path></svg>
            }
            Google
          </Button>
        </Tabs>
      </div>
    </div>
  );
}

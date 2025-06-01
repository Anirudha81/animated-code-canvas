
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import OTPInput from '@/components/OTPInput';

type AuthMode = 'login' | 'signup' | 'verify-signup' | 'verify-login';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOTPLogin, setIsOTPLogin] = useState(false);
  
  const { signIn, signUp, signInWithOTP, sendVerificationCode, verifyEmailCode, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Successfully signed in!');
          navigate('/');
        }
      } else if (mode === 'signup') {
        if (!fullName.trim()) {
          toast.error('Please enter your full name');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Account created! Please verify your email.');
          setMode('verify-signup');
          await handleSendVerificationCode();
        }
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'verify-login') {
        const { error } = await signInWithOTP(email, verificationCode);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Successfully signed in!');
          navigate('/');
        }
      } else if (mode === 'verify-signup') {
        const { error, isValid } = await verifyEmailCode(email, verificationCode);
        if (error || !isValid) {
          toast.error('Invalid or expired verification code');
        } else {
          toast.success('Email verified successfully!');
          navigate('/');
        }
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationCode = async () => {
    setLoading(true);
    try {
      const { error, code } = await sendVerificationCode(email);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification code sent to your email!');
        // For demo purposes, show the code in console
        if (code) {
          console.log('Verification code:', code);
          toast.info(`Demo: Your verification code is ${code}`);
        }
      }
    } catch (error: any) {
      toast.error('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTPLogin = async () => {
    if (!email) {
      toast.error('Please enter your email first');
      return;
    }
    
    setMode('verify-login');
    await handleSendVerificationCode();
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Sign In';
      case 'signup': return 'Create Account';
      case 'verify-signup': return 'Verify Your Email';
      case 'verify-login': return 'Enter Verification Code';
      default: return 'Sign In';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Welcome back to Khare Construction';
      case 'signup': return 'Join Khare Construction';
      case 'verify-signup': return 'Enter the code sent to your email';
      case 'verify-login': return 'Enter the code sent to your email';
      default: return 'Welcome back to Khare Construction';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-neutral-800">
            {getTitle()}
          </CardTitle>
          <p className="text-neutral-600">
            {getSubtitle()}
          </p>
        </CardHeader>
        <CardContent>
          {(mode === 'verify-signup' || mode === 'verify-login') ? (
            <form onSubmit={handleOTPAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <OTPInput
                  length={6}
                  value={verificationCode}
                  onChange={setVerificationCode}
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-neutral-800 hover:bg-neutral-700"
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  className="text-sm text-neutral-600 hover:text-neutral-800 underline"
                  disabled={loading}
                >
                  Resend Code
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'verify-signup' ? 'signup' : 'login');
                    setVerificationCode('');
                  }}
                  className="text-sm text-neutral-600 hover:text-neutral-800 underline"
                >
                  Back to {mode === 'verify-signup' ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordAuth} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required={mode === 'signup'}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-neutral-800 hover:bg-neutral-700"
                disabled={loading}
              >
                {loading ? 'Loading...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </Button>

              {mode === 'login' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleRequestOTPLogin}
                    className="text-sm text-neutral-600 hover:text-neutral-800 underline"
                    disabled={loading}
                  >
                    Sign in with verification code instead
                  </button>
                </div>
              )}
            </form>
          )}
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setVerificationCode('');
              }}
              className="text-sm text-neutral-600 hover:text-neutral-800 underline"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;

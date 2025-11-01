import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SiGoogle, SiApple, SiFacebook } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginScreenProps {
  onNavigateHome: () => void;
}

export default function LoginScreen({ onNavigateHome }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signInWithGoogle, signInWithApple, signInWithFacebook, signInWithEmail, signUp } = useAuth();
  const { toast } = useToast();

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      setLoading(true);
      if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'apple') {
        await signInWithApple();
      } else {
        await signInWithFacebook();
      }
    } catch (error) {
      console.error('Social login error:', error);
      toast({
        title: 'Login Failed',
        description: error instanceof Error ? error.message : 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: 'Success',
          description: 'Account created successfully! Please check your email to confirm.',
        });
      } else {
        await signInWithEmail(email, password);
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        onNavigateHome();
      }
    } catch (error) {
      console.error('Email auth error:', error);
      toast({
        title: isSignUp ? 'Sign Up Failed' : 'Sign In Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto pb-20">
      <div className="flex-1 flex flex-col justify-center p-6 max-w-md mx-auto w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            AfriShorts
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
            data-testid="button-google"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-card hover-elevate active-elevate-2 border-border"
          >
            <SiGoogle className="h-5 w-5" />
            <span>Continue with Google</span>
          </Button>

          <Button
            onClick={() => handleSocialLogin('apple')}
            disabled={loading}
            data-testid="button-apple"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-card hover-elevate active-elevate-2 border-border"
          >
            <SiApple className="h-5 w-5" />
            <span>Continue with Apple</span>
          </Button>

          <Button
            onClick={() => handleSocialLogin('facebook')}
            disabled={loading}
            data-testid="button-facebook"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-card hover-elevate active-elevate-2 border-border"
          >
            <SiFacebook className="h-5 w-5" />
            <span>Continue with Facebook</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Email/Password Login Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
              className="bg-card border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
                className="bg-card border-border pr-10"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="button-toggle-password"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover-elevate active-elevate-2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleEmailAuth}
            disabled={loading}
            data-testid="button-submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full"
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              data-testid="button-toggle-mode"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Guest Access */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={onNavigateHome}
            data-testid="button-guest"
            className="text-muted-foreground hover-elevate active-elevate-2"
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
}

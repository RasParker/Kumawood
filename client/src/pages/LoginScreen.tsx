import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginScreenProps {
  onNavigateHome: () => void;
}

export default function LoginScreen({ onNavigateHome }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

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

        {/* Login Form */}
        <div className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                data-testid="input-name"
                className="bg-card border-border"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
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
            onClick={onNavigateHome}
            data-testid="button-submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover-elevate active-elevate-2 rounded-full"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
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

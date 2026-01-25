import { useState } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../lib/mockData';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Utensils, ChefHat, Sparkles, CheckCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        {/* Floating Decorative Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-300/10 rounded-full blur-2xl"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 right-1/4 opacity-10">
          <ChefHat className="w-16 h-16 text-emerald-600 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-10">
          <Utensils className="w-12 h-12 text-orange-600 animate-pulse" />
        </div>
        <div className="absolute top-1/3 right-20 opacity-10">
          <Sparkles className="w-10 h-10 text-emerald-600" style={{ animation: 'pulse 4s infinite' }} />
        </div>
        <div className="absolute bottom-1/4 right-1/3 opacity-10">
          <CheckCircle className="w-14 h-14 text-orange-600 animate-pulse" style={{ animationDuration: '2s' }} />
        </div>
      </div>

      <Card className="w-full max-w-md shadow-xl relative z-10 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Mealawe</CardTitle>
          <CardDescription>AI-Driven Kitchen Quality Check Platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-4 text-center">Demo Login As:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleLogin('kitchen')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Kitchen User
              </Button>
              <Button
                onClick={() => handleLogin('admin')}
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                Admin
              </Button>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Demo credentials auto-filled for testing
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
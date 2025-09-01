import React, { useEffect, useState } from 'react';
import { AdminSubmissions } from './AdminSubmissions';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { supabaseClient } from '../lib/supabase';

const ADMIN_EMAIL = 'admin@rudracore.com';

export function AdminPage({ language }: { language: 'english' | 'telugu' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (!supabaseClient) return;
      const { data } = await supabaseClient.auth.getUser();
      if (!isMounted) return;
      setUserEmail(data.user?.email || null);
    };
    init();
    return () => { isMounted = false; };
  }, []);

  const isAdmin = (e?: string | null) => (e || userEmail)?.toLowerCase() === ADMIN_EMAIL;

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!supabaseClient) throw new Error('Backend not configured');
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUserEmail(data.user?.email || null);
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin()) {
    return <AdminSubmissions />;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card className="bg-card/80 backdrop-blur border-primary/20">
        <CardContent className="space-y-4 p-4">
          <h1 className="text-lg font-semibold">Admin Login</h1>
          <p className="text-sm text-muted-foreground">Sign in with the admin account to review submissions.</p>
          {error && (
            <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
          )}
          <form onSubmit={signIn} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={ADMIN_EMAIL} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>
            <Button type="submit" className="w-full gradient-primary text-white" disabled={loading}>
              {loading ? '...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

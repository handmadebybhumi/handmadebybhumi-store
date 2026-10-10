import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, Lock, AlertCircle, Mail, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdminLogin() {
  const { isAdmin, loading, signInWithMagicLink } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate(createPageUrl('AdminDashboard'));
    }
  }, [isAdmin, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSent(false);
    try {
      await signInWithMagicLink(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      setError(err.message || 'Unable to send sign-in link. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
        <Package className="w-12 h-12 text-[#D97757] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6] p-4">
      <Card className="w-full max-w-md border-2 border-[#D97757]/20 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#D97757] to-[#C55E3F] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-[#8B6F47]">Admin Login</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and we'll send a secure sign-in link
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {sent && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Check your inbox at <strong>{email}</strong> for a sign-in link.
                Click it to access the admin dashboard.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-2 border-gray-200 focus:border-[#D97757]"
                placeholder="you@example.com"
                disabled={sent}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#D97757] hover:bg-[#C55E3F] text-white"
              disabled={sent}
            >
              <Mail className="w-4 h-4 mr-2" />
              {sent ? 'Link Sent' : 'Send Sign-In Link'}
            </Button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-4">
            Only the authorized store owner can access the admin dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

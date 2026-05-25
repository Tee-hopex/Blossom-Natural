import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useAdminLogin } from '@/hooks/admin/useAdminAuth';
import { useAdminStore } from '@/store/adminStore';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated());
  const { mutateAsync: login, isPending, error } = useAdminLogin();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate('/admin/dashboard', { replace: true });
    } catch {
      // error displayed below
    }
  };

  return (
    <div className="min-h-screen bg-brown flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-sage/20 rounded-2xl mb-4">
            <Leaf className="h-7 w-7 text-sage" />
          </div>
          <h1 className="font-heading text-2xl text-cream">Blossom Natural</h1>
          <p className="text-cream/40 text-sm mt-1">Admin Panel — Sign in to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-cream rounded-2xl p-6 shadow-2xl"
        >
          {error && (
            <div className="mb-4 px-4 py-3 bg-terracotta/10 border border-terracotta/30 rounded-xl text-sm text-terracotta">
              {error.message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full mt-2 disabled:opacity-60"
            >
              {isPending ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </form>

        <p className="text-center text-cream/20 text-xs mt-6">
          Blossom Natural © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

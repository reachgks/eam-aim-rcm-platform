'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { apiFetch } from '@/lib/api';
import {
  Shield, Eye, EyeOff, AlertCircle, Loader2,
  Activity, Wrench, BarChart3, Cpu
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('admin@acme-industrial.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch<any>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        noAuth: true,
      });

      setAuth({
        user: res.user,
        token: res.token,
        refreshToken: res.refreshToken,
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-600/20 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 flex flex-col justify-center px-16 py-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shadow-glow-brand">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EAM Platform</h1>
              <p className="text-sm text-brand-300">Enterprise Asset Management</p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="space-y-8 mb-16">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Manage assets with<br />
              <span className="gradient-text">intelligence & precision</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-md">
              Unified platform for asset lifecycle, maintenance optimization,
              BIM integration, IoT monitoring & reliability engineering.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Activity, label: 'IoT Telemetry', desc: 'Real-time monitoring' },
              { icon: Wrench, label: 'RCM Analytics', desc: 'Reliability optimization' },
              { icon: BarChart3, label: 'KPI Dashboard', desc: 'Actionable insights' },
              { icon: Cpu, label: 'BIM Integration', desc: 'Digital twin ready' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="glass-panel p-4 group hover:border-brand-500/30 transition-all duration-300">
                <Icon className="w-5 h-5 text-brand-400 mb-2 group-hover:text-brand-300 transition-colors" />
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">EAM Platform</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-8 p-4 glass-panel">
            <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-1">
              <p className="text-xs text-slate-400">
                <span className="text-slate-500">Admin:</span>{' '}
                <code className="text-brand-400">admin@acme-industrial.com</code>
              </p>
              <p className="text-xs text-slate-400">
                <span className="text-slate-500">Password:</span>{' '}
                <code className="text-brand-400">admin123</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

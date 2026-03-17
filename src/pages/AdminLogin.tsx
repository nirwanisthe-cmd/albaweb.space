import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Globe, Lock, Mail, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-200">
            <Globe size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500">Sign in to manage Albecket Web Studio</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="admin@albecket.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
            >
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={24} />
            </button>
          </form>
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            ← Back to Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Wallet, Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../utils/api';
import clientCatchError from '../utils/clientCatchError';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);

      const {data} =  await api.post('/user/login', {
        email: formData.email,
        password: formData.password
      });

      toast.success(data.message || 'Login successful! Redirecting...');
      navigate('/dashboard');
    } 
    catch (err) {
      return clientCatchError(err);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E6F4F1] text-[#0F3842] font-sans flex flex-col justify-between p-4">
      
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-[#B2DFDB] p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#0F4C5C] text-white rounded-xl mx-auto flex items-center justify-center font-black text-2xl shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F3842] tracking-tight">
              FinFix
            </h1>
            <p className="text-xs text-[#5C8088] font-medium">
              Welcome back! Log in to your expense tracker.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="block text-xs font-bold text-[#0F3842] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C8088]" />
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#E6F4F1]/40 border border-[#B2DFDB] text-sm text-[#0F3842] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C] transition-all placeholder:text-[#5C8088]/60"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0F3842]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[#0F4C5C] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C8088]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#E6F4F1]/40 border border-[#B2DFDB] text-sm text-[#0F3842] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C] transition-all placeholder:text-[#5C8088]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C8088] hover:text-[#0F4C5C] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0F4C5C] hover:bg-[#0B3844] text-white font-bold text-sm rounded-xl shadow-md shadow-[#0F4C5C]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* FOOTER LINK TO SIGNUP */}
          <div className="pt-4 border-t border-[#B2DFDB]/60 text-center text-xs text-[#5C8088]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-extrabold text-[#0F4C5C] hover:underline">
              Sign Up
            </Link>
          </div>

          {/* SECURITY BADGE */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5C8088] bg-[#E6F4F1] py-2 px-3 rounded-xl border border-[#B2DFDB]">
            <ShieldCheck className="w-4 h-4 text-[#0F4C5C] shrink-0" />
            <span>Encrypted JWT & Secure Password Hashing</span>
          </div>

        </div>
      </div>

      {/* PAGE FOOTER */}
      <footer className="text-center text-xs text-[#5C8088] pb-2">
        © 2026 FinFix Tracker System. All rights reserved.
      </footer>

    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Check, ArrowLeft, Wallet, Loader2
} from 'lucide-react';
import clientCatchError from '../utils/clientCatchError';
import api from '../utils/api';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const naviage = useNavigate()

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    otp: ['', '', '', ''], 
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullname || !formData.email || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    try {
      setLoading(true);

      const {data} = await api.post('/user/signup', {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password
      });

      toast.success(data.message || 'Signup successful');
      setStep('otp'); 
    } 
    catch (err) {
      return clientCatchError(err);
    } 
    finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalOtp = formData.otp.join('');
    if (finalOtp.length < 4) {
      toast.error('Please enter complete 4-digit OTP');
      return;
    }
    try {
      setLoading(true);
      const {data} = await api.post('/user/otp-verify', {email: formData.email, otp: finalOtp});
      toast.success(data.message || 'Signup successful');
      naviage('/login')
    } 
    catch (err) {
      return clientCatchError(err);
    } 
    finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const updatedOtp = [...formData.otp];
    updatedOtp[index] = value;
    setFormData({ ...formData, otp: updatedOtp });

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
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
              {step === 'details' 
                ? 'Create your account to track incomes & expenses.' 
                : 'Enter the 4-digit OTP sent to your email.'}
            </p>
          </div>


          {step === 'details' ? (
            <form onSubmit={handleSignup} className="space-y-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#0F3842] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C8088]" />
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#E6F4F1]/40 border border-[#B2DFDB] text-sm text-[#0F3842] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C] transition-all placeholder:text-[#5C8088]/60"
                  />
                </div>
              </div>

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
                <label className="block text-xs font-bold text-[#0F3842] mb-1.5">
                  Password
                </label>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0F4C5C] hover:bg-[#0B3844] text-white font-bold text-sm rounded-xl shadow-md shadow-[#0F4C5C]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Registering...
                  </>
                ) : (
                  <>
                    Send OTP Verification <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#0F3842] text-center mb-3">
                  4-Digit OTP sent to <span className="underline font-extrabold">{formData.email}</span>
                </label>
                <div className="flex items-center justify-center gap-3">
                  {formData.otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-black bg-[#E6F4F1]/50 border border-[#B2DFDB] text-[#0F3842] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] transition-all"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep('details');
                  }}
                  className="flex items-center gap-1 font-bold text-[#5C8088] hover:text-[#0F4C5C] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to details
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0F4C5C] hover:bg-[#0B3844] text-white font-bold text-sm rounded-xl shadow-md shadow-[#0F4C5C]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Verify & Complete <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#B2DFDB]/60 text-center text-xs text-[#5C8088]">
            Already have a FinFix account?{' '}
            <Link to="/login" className="font-extrabold text-[#0F4C5C] hover:underline">
              Sign In
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5C8088] bg-[#E6F4F1] py-2 px-3 rounded-xl border border-[#B2DFDB]">
            <ShieldCheck className="w-4 h-4 text-[#0F4C5C] shrink-0" />
            <span>Encrypted JWT & Secure Password Hashing</span>
          </div>

        </div>
      </div>

      <footer className="text-center text-xs text-[#5C8088] pb-2">
        © 2026 FinFix Tracker System. All rights reserved.
      </footer>

    </div>
  );
};

export default Signup;
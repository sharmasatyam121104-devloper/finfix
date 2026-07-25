import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  Mail, Lock, Eye, EyeOff, ArrowLeft, Wallet, Loader2, KeyRound, Check, ShieldCheck 
} from 'lucide-react';
import clientCatchError from '../utils/clientCatchError';
import api from '../utils/api';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']); // 4-digit OTP matching backend
  const [newPassword, setNewPassword] = useState('');

  // ------------------- STEP 1: REQUEST OTP -------------------
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Email is required');
      return;
    }

    try {
      setLoading(true);
      const {data} = await api.post('/user/forgot-password', { email });

      toast.success(data.message || 'OTP sent to your email.');
      setStep('verify');

    } catch (error) {
      return clientCatchError(error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------- STEP 2: VERIFY OTP & RESET PASSWORD -------------------
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalOtp = otp.join('');
    
    if (!email || !finalOtp || !newPassword) {
      toast.error('All fields are required');
      return;
    }

    if (finalOtp.length < 4) {
      toast.error('Please enter the complete 4-digit OTP code');
      return;
    }

    try {
      setLoading(true);
      const {data} = await api.post('/user/reset-password', {
        email,
        otp: finalOtp,
        newPassword,
      });

      toast.success(data.message || 'Password reset successfully!');
      navigate('/login');

    } 
    catch (error) {
      return clientCatchError(error);
    } 
    finally {
      setLoading(false);
    }
  };

  // Handle OTP inputs focus shift
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 3) {
      document.getElementById(`reset-otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#E6F4F1] text-[#0F3842] font-sans flex flex-col justify-between p-4">
      
      {/* CENTER CARD CONTAINER */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-[#B2DFDB] p-8 space-y-6">
          
          {/* BRANDING HEADER */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#0F4C5C] text-white rounded-xl mx-auto flex items-center justify-center font-black text-2xl shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F3842] tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs text-[#5C8088] font-medium">
              {step === 'request'
                ? 'Enter your registered email to receive a 4-digit verification code.'
                : 'Enter the 4-digit OTP and set your new account password.'}
            </p>
          </div>

          {/* STEP 1: REQUEST RESET OTP */}
          {step === 'request' ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#E6F4F1]/40 border border-[#B2DFDB] text-sm text-[#0F3842] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]/30 focus:border-[#0F4C5C] transition-all placeholder:text-[#5C8088]/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0F4C5C] hover:bg-[#0B3844] text-white font-bold text-sm rounded-xl shadow-md shadow-[#0F4C5C]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Requesting Code...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" /> Send Reset Code
                  </>
                )}
              </button>
            </form>
          ) : (

            /* STEP 2: VERIFY OTP & ENTER NEW PASSWORD */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F3842] text-center mb-3">
                  4-Digit OTP sent to <span className="underline font-extrabold">{email}</span>
                </label>
                <div className="flex items-center justify-center gap-3">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`reset-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-black bg-[#E6F4F1]/50 border border-[#B2DFDB] text-[#0F3842] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C] transition-all"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F3842] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C8088]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="flex items-center gap-1 font-bold text-[#5C8088] hover:text-[#0F4C5C] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change Email
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0F4C5C] hover:bg-[#0B3844] text-white font-bold text-sm rounded-xl shadow-md shadow-[#0F4C5C]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Resetting Password...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Save & Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* BACK TO LOGIN */}
          <div className="pt-4 border-t border-[#B2DFDB]/60 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F4C5C] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>

          {/* SECURITY FOOTER BADGE */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5C8088] bg-[#E6F4F1] py-2 px-3 rounded-xl border border-[#B2DFDB]">
            <ShieldCheck className="w-4 h-4 text-[#0F4C5C] shrink-0" />
            <span>Encrypted Password Reset Verification</span>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-xs text-[#5C8088] pb-2">
        © 2026 FinFix Tracker System. All rights reserved.
      </footer>

    </div>
  );
};

export default ForgotPassword;
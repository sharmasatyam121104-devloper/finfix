import React from 'react';
import { Home, AlertCircle } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome?: () => void; // Ya fir Router hook use kar sakte ho jaise useNavigate()
}

export const NotFound: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      // Fallback agar React Router use kar rahe ho
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans antialiased">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 sm:p-10 text-center space-y-6">
        
        {/* Floating 404 Visual Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center bg-[#E6F4F1] rounded-full border border-[#B2DFDB]/60">
          <AlertCircle className="w-12 h-12 text-[#0F4C5C]" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
          </span>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#0F4C5C] bg-[#E6F4F1] px-3 py-1 rounded-full">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight pt-2">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400 max-w-xs mx-auto leading-relaxed">
            Oops! Aap jo page dhoondh rahe hain woh shayad move ho gaya hai ya exist nahi karta.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleGoHome}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-black text-white bg-[#0F4C5C] hover:bg-[#0A2540] shadow-md shadow-[#0F4C5C]/20 transition-all active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
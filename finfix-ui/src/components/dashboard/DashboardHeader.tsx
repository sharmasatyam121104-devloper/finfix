import type { FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet, User, LogOut, LayoutDashboard } from 'lucide-react';
import clientCatchError from '../../utils/clientCatchError';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuthStore } from '../../zustand/useAuthStore';

interface DashboardHeaderProps {
  userName?: string;
}

export const DashboardHeader: FC<DashboardHeaderProps> = () => {
  const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const clearUser = useAuthStore((state) => state.clearUser);

  const handleLogout = async() => {
    try {
      const {data} = await api.get('/user/logout');
      toast.success(data.message);
      clearUser();
      navigate('/login');
    } 
    catch (error) {
      return clientCatchError(error);  
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#E6F4F1]/90 backdrop-blur-xl border-b border-[#B2DFDB]/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. Application Logo + 2. Dashboard Title */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-[#0F4C5C] text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-[#0F4C5C]/20 group-hover:scale-105 transition-all">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F3842]">
              FinFix
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#0F4C5C]">
              <LayoutDashboard className="w-3 h-3" />
              <span>Dashboard</span>
            </div>
          </div>
        </Link>

        {/* Right Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* 3. Logged-in User Name */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#B2DFDB]/70 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-[#5C8088]">
              Welcome, <strong className="text-[#0F3842] font-black capitalize">{user?.fullname}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 4. Profile Button */}
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-extrabold text-[#0F3842] bg-white border border-[#B2DFDB] hover:border-[#0F4C5C] rounded-xl transition-all shadow-sm active:scale-95"
            >
              <User className="w-4 h-4 text-[#0F4C5C]" />
              <span className="hidden md:inline">Profile</span>
            </button>

            {/* 5. Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-extrabold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};

export default DashboardHeader;
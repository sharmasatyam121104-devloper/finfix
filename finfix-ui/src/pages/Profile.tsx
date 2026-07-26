import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Camera, 
  Lock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import clientCatchError from '../utils/clientCatchError';
import api from '../utils/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// 1. User Data Interface
export interface UserProfile {
  _id: string;
  fullname: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastLogin: string;
  profileImage?: string;
}

interface ProfileProps {
  onBackToDashboard?: () => void;
}


const Profile: React.FC<ProfileProps> = () => {
  // --- STATES ---
  // Photo Upload States
  const [me, setMe] = useState<UserProfile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(me?.profileImage || null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Password Change States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Alert / Feedback Message State
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Date Formatter Helper
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); 
    console.log(previewUrl);
  }
};

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Kripya pehle photo select karein!' });
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setMessage(null);

      // Backend multer ke liye FormData bana rahe hain
      const formData = new FormData();
      formData.append('image', selectedFile); // Backend: upload.single("image")

      const {data} = await api.put('/user/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

        setMe((prev) => {
        if (!prev) return null;

        return {
            ...prev,
            profileImage: `${data.imageUrl}?t=${Date.now()}`
        };
        });

        console.log(data);
      toast.success(data.message)
      setSelectedFile(null);
    } 
    catch (error) {
        return clientCatchError(error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };


  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      setMessage({ type: 'error', text: 'Dono passwords bharna zaroori hai!' });
      return;
    }

    try {
      setIsChangingPassword(true);
      setMessage(null);

      const {data} = await api.put('/user/change-password', {
        oldPassword,
        newPassword,
      });

      toast.success(data.message);
      setOldPassword('');
      setNewPassword('');
    } 
    catch (error) {
        return clientCatchError(error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  useEffect(()=>{
    const getMe = async() => {
      try {
        const {data} = await api.get('/user/getMe');
        setMe(data);
      } 
      catch (error) {
        return clientCatchError(error);
      }
    }

    getMe();
  },[])

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased pb-16">
      
      {/* Top Navbar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to={'/dashboard'}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#0F4C5C] bg-slate-50 hover:bg-[#E6F4F1] px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          
          <span className="text-xs font-black uppercase tracking-widest text-[#0F4C5C] bg-[#E6F4F1] px-3 py-1 rounded-full">
            User Profile
          </span>
        </div>
      </div>

      {/* Main Page Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Global Feedback Alert Message */}
        {message && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold transition-all ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* 1. Header Banner & Identity Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="h-28 bg-linear-to-r from-[#0F4C5C] to-[#0A2540] relative"></div>

          <div className="px-6 sm:px-8 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-10 mb-4">
              
              {/* Profile Avatar Frame */}
              <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-md inline-block">
                <div className="w-full h-full rounded-xl bg-[#E6F4F1] border border-[#B2DFDB]/60 overflow-hidden flex items-center justify-center text-[#0F4C5C]">
                  {me?.profileImage ? (
                    <img src={me.profileImage} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex">
                {me?.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verified Account
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
                    Unverified Account
                  </span>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#0A2540] tracking-tight">
                {me?.fullname}
              </h1>
              <p className="text-xs font-semibold text-slate-400 mt-0.5 font-mono">
                ID: {me?._id}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Basic Details Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-[#0A2540] pb-3 border-b border-slate-100">
            Account Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#0F4C5C]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Full Name</span>
                <span className="text-xs sm:text-sm font-bold text-[#0A2540] mt-0.5 block">{me?.fullname}</span>
              </div>
            </div>

            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#0F4C5C]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Email Address</span>
                <span className="text-xs sm:text-sm font-bold text-[#0A2540] mt-0.5 block break-all">{me?.email}</span>
              </div>
            </div>

            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#0F4C5C]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Joined On</span>
                <span className="text-xs sm:text-sm font-bold text-[#0A2540] mt-0.5 block">{me && formatDate(me?.createdAt)}</span>
              </div>
            </div>

            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-[#0F4C5C]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Last Active</span>
                <span className="text-xs sm:text-sm font-bold text-[#0A2540] mt-0.5 block">{me && formatDate(me?.lastLogin)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Photo Upload Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Camera className="w-4 h-4 text-[#0F4C5C]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0A2540]">
              Update Profile Picture
            </h2>
          </div>

          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#E6F4F1] file:text-[#0F4C5C] hover:file:bg-[#b2dfdb] cursor-pointer"
            />

            <button
              onClick={handleUploadPhoto}
              disabled={isUploadingPhoto || !selectedFile}
              className="px-5 py-2.5 bg-[#0F4C5C] text-white rounded-xl text-xs font-bold hover:bg-[#0A2540] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isUploadingPhoto ? 'Uploading...' : 'Save New Photo'}
            </button>
          </div>
        </div>

        {/* 4. Password Change Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-4 h-4 text-[#0F4C5C]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-[#0A2540]">
              Change Password
            </h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="px-5 py-2.5 bg-[#0F4C5C] text-white rounded-xl text-xs font-bold hover:bg-[#0A2540] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isChangingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
};

export default Profile;
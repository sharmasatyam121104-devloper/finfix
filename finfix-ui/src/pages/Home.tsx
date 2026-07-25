import React, { useState, useMemo } from 'react';
import { 
  Calendar, Users, Clock, ShieldCheck, Activity, 
  Search, Bell, ChevronRight, Plus, User, Settings,
  CheckCircle2, AlertCircle, FileText, Check
} from "lucide-react";

// --- THEME COLOR ARCHETYPES (Solid Canvas Themes) ---
type ColorTheme = 'teal' | 'royal' | 'emerald' | 'indigo';

interface ThemeConfig {
  name: string;
  bodyBg: string;       // Canvas background
  sidebarBg: string;    // Sidebar solid bg
  headerBg: string;     // Header solid bg
  cardBg: string;       // Card background
  cardBorder: string;   // Card border
  primaryBtn: string;   // CTA Button
  textMain: string;     // Primary Text
  textMuted: string;    // Secondary Text
  badgeBg: string;      // Accent Pill Bg
}

const COLOR_PRESETS: Record<ColorTheme, ThemeConfig> = {
  teal: {
    name: 'Clinical Teal',
    bodyBg: 'bg-[#E6F4F1]', 
    sidebarBg: 'bg-[#0F4C5C]', 
    headerBg: 'bg-white', 
    cardBg: 'bg-white', 
    cardBorder: 'border-[#B2DFDB]', 
    primaryBtn: 'bg-[#0F4C5C] hover:bg-[#0B3844] text-white', 
    textMain: 'text-[#0F3842]', 
    textMuted: 'text-[#5C8088]', 
    badgeBg: 'bg-[#E0F2F1] text-[#00695C]',
  },
  royal: {
    name: 'Royal Blue',
    bodyBg: 'bg-[#EEF2FF]', 
    sidebarBg: 'bg-[#1E1B4B]', 
    headerBg: 'bg-white', 
    cardBg: 'bg-white', 
    cardBorder: 'border-[#C7D2FE]', 
    primaryBtn: 'bg-[#4338CA] hover:bg-[#3730A3] text-white', 
    textMain: 'text-[#1E1B4B]', 
    textMuted: 'text-[#6366F1]', 
    badgeBg: 'bg-[#E0E7FF] text-[#3730A3]',
  },
  emerald: {
    name: 'Medical Mint',
    bodyBg: 'bg-[#E6F4EA]', 
    sidebarBg: 'bg-[#064E3B]', 
    headerBg: 'bg-white', 
    cardBg: 'bg-white', 
    cardBorder: 'border-[#A7F3D0]', 
    primaryBtn: 'bg-[#047857] hover:bg-[#065F46] text-white', 
    textMain: 'text-[#022C22]', 
    textMuted: 'text-[#047857]', 
    badgeBg: 'bg-[#D1FAE5] text-[#065F46]',
  },
  indigo: {
    name: 'Slate Navy',
    bodyBg: 'bg-[#F1F5F9]', 
    sidebarBg: 'bg-[#0F172A]', 
    headerBg: 'bg-white', 
    cardBg: 'bg-white', 
    cardBorder: 'border-[#CBD5E1]', 
    primaryBtn: 'bg-[#0F172A] hover:bg-[#1E293B] text-white', 
    textMain: 'text-[#0F172A]', 
    textMuted: 'text-[#64748B]', 
    badgeBg: 'bg-[#E2E8F0] text-[#1E293B]',
  }
};

// --- MOCK DATA ---
const DOCTORS_LIST = [
  { id: '1', name: 'Dr. Richard James', specialty: 'General Physician', available: true },
  { id: '2', name: 'Dr. Emily Larson', specialty: 'Gynecologist', available: true },
  { id: '3', name: 'Dr. Alison Patel', specialty: 'Dermatologist', available: false },
  { id: '4', name: 'Dr. Christopher Lee', specialty: 'Pediatrician', available: true },
];

const APPOINTMENTS_LIST = [
  { id: 'a1', patient: 'Sarah Jenkins', doctor: 'Dr. Richard James', time: '10:00 AM', status: 'Confirmed' },
  { id: 'a2', patient: 'Michael Chang', doctor: 'Dr. Emily Larson', time: '11:30 AM', status: 'Pending' },
  { id: 'a3', patient: 'Emma Watson', doctor: 'Dr. Alison Patel', time: '02:15 PM', status: 'Confirmed' },
  { id: 'a4', patient: 'David Miller', doctor: 'Dr. Christopher Lee', time: '04:00 PM', status: 'Pending' },
];

const PrescriptoSolidDashboard: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<ColorTheme>('teal');
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentTheme = COLOR_PRESETS[activeTheme];

  const filteredAppointments = useMemo(() => {
    return APPOINTMENTS_LIST.filter((item) => {
      const matchesTab = activeTab === 'all' || item.status === 'Pending';
      const matchesSearch = 
        item.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.doctor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className={`min-h-screen ${currentTheme.bodyBg} ${currentTheme.textMain} font-sans flex flex-col md:flex-row transition-colors duration-300`}>
      
      {/* --- SOLID SIDEBAR --- */}
      <aside className={`w-full md:w-64 ${currentTheme.sidebarBg} text-white p-5 flex flex-col justify-between shrink-0 shadow-lg`}>
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-white text-slate-900 rounded-xl flex items-center justify-center font-black text-xl shadow">
              P
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight block leading-none">Prescripto</span>
              <span className="text-[10px] font-medium text-slate-300 opacity-80 uppercase tracking-widest">Medical Ops</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {[
              { label: 'Dashboard', icon: Activity, active: true },
              { label: 'Appointments', icon: Calendar },
              { label: 'Doctors', icon: Users },
              { label: 'Patients', icon: User },
              { label: 'Schedule', icon: Clock },
              { label: 'Prescriptions', icon: ShieldCheck },
              { label: 'Analytics', icon: FileText },
            ].map((link, idx) => (
              <a
                key={idx}
                href={`#${link.label.toLowerCase()}`}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  link.active 
                    ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="pt-4 border-t border-white/10 mt-6">
          <a href="#settings" className="flex items-center gap-2 text-xs font-medium text-white/70 hover:text-white transition-colors">
            <Settings className="w-4 h-4" /> System Settings & Security
          </a>
        </div>
      </aside>

      {/* --- MAIN CONTENT CANVAS --- */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP THEME SELECTION BAR */}
        <div className="bg-white/60 backdrop-blur-md border-b border-slate-200/60 px-6 py-2 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-600">Select Solid Color Palette:</span>
          
          <div className="flex items-center gap-2">
            {(Object.keys(COLOR_PRESETS) as ColorTheme[]).map((themeKey) => (
              <button
                key={themeKey}
                onClick={() => setActiveTheme(themeKey)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTheme === themeKey 
                    ? 'bg-slate-900 text-white shadow' 
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {activeTheme === themeKey && <Check className="w-3 h-3 text-emerald-400" />}
                {COLOR_PRESETS[themeKey].name}
              </button>
            ))}
          </div>
        </div>

        {/* HEADER TOOLBAR */}
        <header className={`${currentTheme.headerBg} h-16 border-b ${currentTheme.cardBorder} px-6 flex items-center justify-between gap-4 shadow-sm`}>
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients, doctors..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-slate-800 rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
            </button>
            
            <a href="#help" className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:block">Help Center</a>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className={`w-8 h-8 rounded-lg ${currentTheme.sidebarBg} text-white font-bold flex items-center justify-center text-xs`}>
                OP
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT BODY */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* HEADER TITLE & BUTTONS */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Operator Dashboard</h1>
              <p className={`text-sm ${currentTheme.textMuted}`}>Overview of active clinic operations and bookings.</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setActiveTab(activeTab === 'all' ? 'pending' : 'all')}
                className={`px-3.5 py-2 text-xs font-bold border ${currentTheme.cardBorder} bg-white rounded-lg shadow-sm hover:bg-slate-50 transition-all`}
              >
                Filter: <span className="font-extrabold">{activeTab === 'all' ? 'All' : 'Pending Only'}</span>
              </button>

              <button className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-lg">
                Export Log
              </button>

              <button className={`px-4 py-2 text-xs font-bold rounded-lg shadow ${currentTheme.primaryBtn} flex items-center gap-1.5 transition-all`}>
                <Plus className="w-4 h-4" /> New Booking
              </button>
            </div>
          </div>

          {/* METRIC CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Appointments', val: '124', change: '+12% from yesterday', isGood: true },
              { label: 'Active Doctors', val: '18', change: '4 on leave', isGood: false },
              { label: 'Pending Requests', val: '9', change: 'Requires attention', isGood: false },
              { label: 'Completed Today', val: '42', change: '94% fulfillment', isGood: true },
            ].map((m, idx) => (
              <div key={idx} className={`${currentTheme.cardBg} p-4 border ${currentTheme.cardBorder} rounded-xl shadow-sm hover:shadow transition-shadow`}>
                <p className={`text-xs font-semibold ${currentTheme.textMuted}`}>{m.label}</p>
                <p className="text-2xl font-black mt-1">{m.val}</p>
                <p className={`text-xs mt-1.5 font-bold flex items-center gap-1 ${m.isGood ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {m.isGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {m.change}
                </p>
              </div>
            ))}
          </section>

          {/* MAIN GRID CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* APPOINTMENTS LIST */}
            <div className={`lg:col-span-2 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-5 shadow-sm`}>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h2 className="text-base font-extrabold">Today's Appointments</h2>
                <a href="#all" className={`text-xs font-bold ${currentTheme.textMuted} hover:underline flex items-center`}>
                  View All <ChevronRight className="w-3 h-3" />
                </a>
              </div>

              <ul className="divide-y divide-slate-100">
                {filteredAppointments.map((item) => (
                  <li key={item.id} className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-lg transition-colors">
                    <div>
                      <p className="text-sm font-bold">{item.patient}</p>
                      <p className={`text-xs ${currentTheme.textMuted}`}>{item.doctor} • <span className="font-semibold">{item.time}</span></p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      item.status === 'Confirmed' ? currentTheme.badgeBg : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DOCTORS LIST */}
            <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-5 shadow-sm`}>
              <h2 className="text-base font-extrabold mb-4 pb-2 border-b border-slate-100">Available Doctors</h2>
              <div className="space-y-3">
                {DOCTORS_LIST.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold">{doc.name}</p>
                      <p className={`text-[11px] ${currentTheme.textMuted}`}>{doc.specialty}</p>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${doc.available ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-300'}`} />
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* FOOTER */}
          <footer className={`pt-6 border-t ${currentTheme.cardBorder} flex flex-col sm:flex-row justify-between items-center text-xs ${currentTheme.textMuted}`}>
            <p>© 2026 Prescripto Medical Systems. All rights reserved.</p>
            <div className="flex gap-4 mt-2 sm:mt-0 font-medium">
              <a href="#privacy" className="hover:underline">Privacy Policy</a>
              <a href="#terms" className="hover:underline">Terms of Service</a>
              <a href="#support" className="hover:underline">Support Contact</a>
            </div>
          </footer>

        </div>
      </main>

    </div>
  );
};

export default PrescriptoSolidDashboard;
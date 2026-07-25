import 'animate.css';import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Wallet, ArrowRight, ShieldCheck, Layers, Filter, 
  KeyRound, PlusCircle, Search, ArrowUpRight, ArrowDownRight, 
  Sparkles, RefreshCw, LayoutDashboard, 
} from 'lucide-react';

// ==========================================
// 1. STRICT TYPESCRIPT INTERFACES
// ==========================================
export type TransactionType = 'income' | 'expense';
export type FilterType = 'all' | 'income' | 'expense';
export type SortOption = 'date-desc' | 'date-asc' | 'amount-high' | 'amount-low';

export interface ITransaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export interface ITransactionFormData {
  description: string;
  amount: string;
  type: TransactionType;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // ==========================================
  // 2. STATE MANAGEMENT WITH EXPLICIT TYPES
  // ==========================================
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy] = useState<SortOption>('date-desc');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<ITransactionFormData>({
    description: '',
    amount: '',
    type: 'expense'
  });

  // Mock Transactions Data with ITransaction Type
  const [transactions, setTransactions] = useState<ITransaction[]>([
    { id: '1', description: 'Freelance Frontend Retainer', category: 'Income', amount: 45000, type: 'income', date: '2026-07-26' },
    { id: '2', description: 'AWS Server Hosting', category: 'Infrastructure', amount: 3200, type: 'expense', date: '2026-07-25' },
    { id: '3', description: 'Client Final Milestone', category: 'Income', amount: 85000, type: 'income', date: '2026-07-24' },
    { id: '4', description: 'Team Outing & Catering', category: 'Food & Dining', amount: 4800, type: 'expense', date: '2026-07-22' },
  ]);

  // Direct Navigation Helper
  const goToDashboard = (): void => {
    // Navigates directly to main Dashboard app
    navigate('/dashboard');
  };

  // Handle Form Change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Form Submit (Demo Add + Option to jump to real app)
  const handleAddTransaction = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount || parseFloat(formData.amount) <= 0) return;

    setIsAdding(true);

    const newTx: ITransaction = {
      id: Date.now().toString(),
      description: formData.description.trim(),
      category: formData.type === 'income' ? 'Income' : 'General Expense',
      amount: parseFloat(formData.amount),
      type: formData.type,
      date: new Date().toISOString().split('T')[0]
    };

    setTimeout(() => {
      setTransactions(prev => [newTx, ...prev]);
      setFormData({ description: '', amount: '', type: 'expense' });
      setIsAdding(false);
    }, 300);
  };

  // Filter & Sort Logic
  const processedTransactions: ITransaction[] = transactions
    .filter((tx: ITransaction) => {
      const matchesType = activeFilter === 'all' || tx.type === activeFilter;
      const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a: ITransaction, b: ITransaction) => {
      if (sortBy === 'amount-high') return b.amount - a.amount;
      if (sortBy === 'amount-low') return a.amount - b.amount;
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });

  return (
    <div className="min-h-screen bg-[#E6F4F1] text-[#0F3842] font-sans flex flex-col justify-between selection:bg-[#0F4C5C] selection:text-white overflow-x-hidden">
      
      {/* ------------------- TOP NAVBAR ------------------- */}
      <header className="sticky top-0 z-50 bg-[#E6F4F1]/90 backdrop-blur-xl border-b border-[#B2DFDB]/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-[#0F4C5C] text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-[#0F4C5C]/20 group-hover:scale-105 transition-all">
              <Wallet className="w-6 h-6 animate__animated animate__pulse animate__infinite animate__slower" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#0F3842]">FinFix</span>
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#5C8088]">SaaS Suite</span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-black tracking-wider uppercase text-[#5C8088]">
            <a href="#live-demo" className="hover:text-[#0F4C5C] transition-colors">Live Preview</a>
            <a href="#features" className="hover:text-[#0F4C5C] transition-colors">Features</a>
            <a href="#security" className="hover:text-[#0F4C5C] transition-colors">Security</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#0F4C5C] bg-white border border-[#B2DFDB] hover:border-[#0F4C5C] hover:bg-white/90 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Log In
            </button>
            
            <button
              onClick={goToDashboard}
              className="px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white bg-[#0F4C5C] hover:bg-[#0B3844] rounded-xl shadow-md shadow-[#0F4C5C]/25 transition-all flex items-center gap-2 active:scale-95"
            >
              Open Dashboard
              <LayoutDashboard className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* ------------------- HERO SECTION ------------------- */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#B2DFDB]/50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#B2DFDB] shadow-sm animate__animated animate__fadeInDown">
            <Sparkles className="w-4 h-4 text-[#0F4C5C]" />
            <span className="text-xs font-bold text-[#0F4C5C] uppercase tracking-wider">MERN Stack Assignment</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-[#0F3842] leading-[1.1] tracking-tight animate__animated animate__fadeInUp">
            Smart Expense Tracking <br />
            <span className="text-[#0F4C5C] underline decoration-[#B2DFDB] underline-offset-8">Engineered for Precision</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5C8088] font-medium leading-relaxed max-w-2xl mx-auto animate__animated animate__fadeInUp animate__delay-1s">
            Manage transactions, apply filters, and access secured profile session with OTP verification & JWT route protection.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 animate__animated animate__fadeInUp animate__delay-1s">
            <button
              onClick={goToDashboard}
              className="w-full sm:w-auto px-8 py-4 bg-[#0F4C5C] hover:bg-[#0B3844] text-white font-extrabold text-base rounded-2xl shadow-xl shadow-[#0F4C5C]/20 transition-all flex items-center justify-center gap-3 active:scale-95 group"
            >
              Launch Full Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#E6F4F1]/50 text-[#0F3842] border border-[#B2DFDB] font-extrabold text-base rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Sign In to Profile
            </button>
          </div>

        </div>

        {/* ------------------- INTERACTIVE DEMO ------------------- */}
        <div id="live-demo" className="mt-14 max-w-6xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-[#B2DFDB] animate__animated animate__zoomIn">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E6F4F1] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-[#5C8088] ml-2">Interactive Preview</span>
            </div>
            
            {/* Top Bar CTA to Navigate */}
            <button
              onClick={goToDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F4C5C] text-white text-xs font-bold rounded-xl hover:bg-[#0B3844] transition-all shadow-sm active:scale-95"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Use All Features in Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
            
            {/* Left: Quick Form */}
            <div className="lg:col-span-5 bg-[#E6F4F1]/40 p-6 rounded-2xl border border-[#B2DFDB]/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-[#0F3842] flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-[#0F4C5C]" /> Quick Add Demo
                </h3>
                <span className="text-[10px] font-extrabold uppercase bg-white border border-[#B2DFDB] px-2 py-0.5 rounded-md text-[#5C8088]">
                  Demo Mode
                </span>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#5C8088] mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        formData.type === 'income' 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-white border-[#B2DFDB] text-[#5C8088]'
                      }`}
                    >
                      + Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        formData.type === 'expense' 
                          ? 'bg-rose-600 text-white border-rose-600' 
                          : 'bg-white border-[#B2DFDB] text-[#5C8088]'
                      }`}
                    >
                      - Expense
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5C8088] mb-1">Description</label>
                  <input
                    type="text"
                    name="description"
                    required
                    placeholder="e.g. Server bill, Freelance"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#B2DFDB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5C8088] mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    required
                    placeholder="e.g. 1500"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#B2DFDB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="py-2.5 bg-[#0F4C5C] hover:bg-[#0B3844] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    {isAdding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PlusCircle className="w-3.5 h-3.5" />}
                    Add Demo
                  </button>
                  <button
                    type="button"
                    onClick={goToDashboard}
                    className="py-2.5 bg-white border border-[#0F4C5C] text-[#0F4C5C] hover:bg-[#E6F4F1] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
                  >
                    Go Dashboard →
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Interactive List View */}
            <div className="lg:col-span-7 space-y-4">
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C8088]" />
                  <input
                    type="text"
                    placeholder="Search demo items..."
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#E6F4F1]/30 border border-[#B2DFDB]/60 text-xs text-[#0F3842] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-[#E6F4F1] p-1 rounded-xl">
                  {(['all', 'income', 'expense'] as FilterType[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                        activeFilter === filter 
                          ? 'bg-[#0F4C5C] text-white shadow-sm' 
                          : 'text-[#5C8088] hover:text-[#0F3842]'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions Container */}
              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {processedTransactions.map((tx: ITransaction) => (
                  <div
                    key={tx.id}
                    onClick={goToDashboard}
                    className="flex items-center justify-between p-3.5 bg-[#E6F4F1]/20 hover:bg-[#E6F4F1]/60 cursor-pointer rounded-2xl border border-[#B2DFDB]/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          tx.type === 'income'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-[#0F3842] group-hover:text-[#0F4C5C] flex items-center gap-1.5">
                          {tx.description}
                        </div>
                        <div className="text-[11px] text-[#5C8088] font-medium">{tx.date} • {tx.category}</div>
                      </div>
                    </div>
                    <div className={`text-xs font-black ${tx.type === 'income' ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {tx.type === 'income' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* ------------------- CORE FEATURES ------------------- */}
      <section id="features" className="py-20 bg-white border-y border-[#B2DFDB]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-[#0F3842]">App Functionalities</h2>
            <p className="text-sm font-medium text-[#5C8088]">
              Click any feature block to navigate directly to the Dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              onClick={goToDashboard}
              className="p-8 rounded-3xl bg-[#E6F4F1]/40 border border-[#B2DFDB] space-y-4 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-[#0F4C5C] text-white rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#0F3842] group-hover:text-[#0F4C5C]">1. Live Dashboard</h3>
              <p className="text-xs text-[#5C8088] leading-relaxed font-medium">
                Add incomes & expenses with complete real-time calculation and category management.
              </p>
            </div>

            <div 
              onClick={goToDashboard}
              className="p-8 rounded-3xl bg-[#E6F4F1]/40 border border-[#B2DFDB] space-y-4 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-[#0F4C5C] text-white rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Filter className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#0F3842] group-hover:text-[#0F4C5C]">2. Filters & Pagination</h3>
              <p className="text-xs text-[#5C8088] leading-relaxed font-medium">
                Server-side sorting, type filtering, date ranges, and fast paginated tables.
              </p>
            </div>

            <div 
              onClick={() => navigate('/profile')}
              className="p-8 rounded-3xl bg-[#E6F4F1]/40 border border-[#B2DFDB] space-y-4 hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-[#0F4C5C] text-white rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#0F3842] group-hover:text-[#0F4C5C]">3. Profile & OTP Auth</h3>
              <p className="text-xs text-[#5C8088] leading-relaxed font-medium">
                Manage personal profile details, reset password with OTP, and control JWT sessions.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------- SECURITY ------------------- */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0F4C5C] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 animate__animated animate__fadeIn">
          <div className="space-y-4 max-w-xl z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-[#B2DFDB]">
              <ShieldCheck className="w-4 h-4" /> Protected Session Routing
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Protected Route Session</h2>
            <p className="text-sm text-[#E6F4F1]/80 font-medium leading-relaxed">
              Unauthenticated users are automatically redirected to Login when attempting to access the main Dashboard or Profile.
            </p>
          </div>

          <button
            onClick={goToDashboard}
            className="w-full md:w-auto px-8 py-4 bg-white text-[#0F4C5C] hover:bg-[#E6F4F1] font-black text-sm rounded-2xl shadow-xl transition-all active:scale-95 whitespace-nowrap z-10 flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Open Dashboard App
          </button>
        </div>
      </section>

      {/* ------------------- FOOTER ------------------- */}
      <footer className="bg-white border-t border-[#B2DFDB]/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#5C8088]">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#0F4C5C]" />
            <span className="font-bold text-[#0F3842]">FinFix Expense Application</span>
          </div>
          <div>TypeScript + React + Axios + Sonner + Animate.css</div>
          <div>© 2026 FinFix Tracker Systems</div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
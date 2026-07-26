import type { FC } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, IndianRupee } from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
}

interface SummaryCardsProps {
  balance?: number;
  totalIncome?: number;
  totalExpense?: number;
}

export const SummaryCards: FC<SummaryCardsProps> = ({
  balance = 0,
  totalIncome = 0,
  totalExpense = 0,
}) => {


  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Total Income */}
        <div className="bg-white rounded-2xl p-6 border border-[#B2DFDB]/70 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C8088]">
              Total Income
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 flex items-center">
              <IndianRupee/> {totalIncome.toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold border border-emerald-100">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Expense */}
        <div className="bg-white rounded-2xl p-6 border border-[#B2DFDB]/70 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C8088]">
              Total Expense
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-600 flex items-center">
              <IndianRupee/> {totalExpense.toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-bold border border-rose-100">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Current Balance */}
        <div className="bg-[#0F4C5C] text-white rounded-2xl p-6 shadow-lg shadow-[#0F4C5C]/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B2DFDB]">
              Current Balance
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center">
              <IndianRupee/> {balance.toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center font-bold backdrop-blur-sm border border-white/20">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default SummaryCards;
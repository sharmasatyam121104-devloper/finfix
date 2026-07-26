import  { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { ArrowUpDown } from 'lucide-react';
import api from '../../utils/api';

export type SortOption =
  | 'latest-first'
  | 'oldest-first'
  | 'highest-amount'
  | 'lowest-amount'
  | 'income-first'
  | 'expense-first';

  interface Transaction {
    _id: string;
    userId: string;
    type: "income" | "expense";
    description: string;
    amount: number;
    category: string;
    transactionDate: string;
    createdAt: string;
    updatedAt: string;
  }



const SortingSection: FC = () => {
  const [currentSort, setCurrentSort] =useState<SortOption>('latest-first');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value as SortOption;

  setCurrentSort(value);
  handleSortChange(value);
};
const handleSortChange = async (value: SortOption) => {
  const params: Record<string, string> = {};

  switch (value) {
    case "latest-first":
      params.sortBy = "updatedAt";
      params.sortOrder = "desc";
      break;

    case "oldest-first":
      params.sortBy = "updatedAt";
      params.sortOrder = "asc";
      break;

    case "highest-amount":
      params.sortBy = "amount";
      params.sortOrder = "desc";
      break;

    case "lowest-amount":
      params.sortBy = "amount";
      params.sortOrder = "asc";
      break;

    case "income-first":
      params.type = "income";
      break;

    case "expense-first":
      params.type = "expense";
      break;
  }

  const { data } = await api.get("/expense", { params });

  setTransactions(data.transactions);
};

  return (
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 space-y-3">
    
    {/* 1. Top Control Bar (Sort Dropdown Only) */}
    <div className="flex items-center justify-between bg-white rounded-2xl border border-[#B2DFDB]/70 p-3.5 px-5 shadow-sm">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-[#0F4C5C]" />
        <span className="text-xs font-black uppercase tracking-wider text-[#0F3842]">
          Sort By
        </span>
      </div>

      <div className="w-44 sm:w-56">
        <select
          value={currentSort}
          onChange={handleChange}
          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-[#0F3842] font-semibold text-xs focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all cursor-pointer"
        >
          <option value="latest-first">Latest First</option>
          <option value="oldest-first">Oldest First</option>
          <option value="highest-amount">Highest Amount</option>
          <option value="lowest-amount">Lowest Amount</option>
          <option value="income-first">Income First</option>
          <option value="expense-first">Expense First</option>
        </select>
      </div>
    </div>

    {/* 2. Main Transactions Table Box */}
    <div className="bg-white rounded-2xl border border-[#B2DFDB]/70 shadow-sm overflow-hidden">
      {transactions.length === 0 ? (
        <div className="p-10 text-center text-slate-400 font-medium text-sm">
          No transactions found.
        </div>
      ) : (
        <>
          {/* Desktop View (Standard Table) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-[#0F3842]">
                  <th className="py-3.5 px-5">Description</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Type</th>
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                {transactions.map((item) => (
                  <tr key={item._id || item._id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Description */}
                    <td className="py-3.5 px-5 text-[#0F3842] font-bold">
                      {item.description}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-5 text-slate-500">
                      {item.category}
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                          item.type === 'income'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      className={`py-3.5 px-5 font-black text-xs ${
                        item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.type === 'income' ? '+' : '-'} ₹{item.amount.toLocaleString('en-IN')}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-5 text-slate-400 font-medium text-right">
                      {new Date(item.transactionDate).toLocaleDateString()}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Clean Cards Layout) */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {transactions.map((item) => (
              <div key={item._id || item._id} className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-[#0F3842] text-sm">{item.description}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{item.category}</p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      item.type === 'income'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-50 text-xs">
                  <span className="text-slate-400 font-medium">
                    {new Date(item.transactionDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`font-black text-sm ${
                      item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {item.type === 'income' ? '+' : '-'} ₹{item.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>

  </div>
  );
};

export default SortingSection;
import { useState } from "react";
import type { FC, FormEvent, ChangeEvent } from "react";
import api from "../../utils/api";
import { Calendar, Check, DollarSign, Filter, RotateCcw, Tag } from "lucide-react";

export type TransactionType = "all" | "income" | "expense";

interface IFilterState {
  type: TransactionType;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
}

interface Transaction {
  _id: string;
  userId: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  transactionDate: string;
}

const initialFilterState: IFilterState = {
  type: "all",
  startDate: "",
  endDate: "",
  minAmount: "",
  maxAmount: "",
};

const FilterSection: FC = () => {
  const [filters, setFilters] = useState(initialFilterState);
  const [transactions, setTransactions] = useState<Transaction[]>([]);


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApply = async (e: FormEvent) => {
    e.preventDefault();

    const params: Record<string, string> = {};

    if (filters.type !== "all") params.type = filters.type;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.minAmount) params.minAmount = filters.minAmount;
    if (filters.maxAmount) params.maxAmount = filters.maxAmount;

    const { data } = await api.get("/expense", { params });

    setTransactions(data.transactions);
  };

  const handleClear = async () => {
    setFilters(initialFilterState);
    setTransactions([])
  };

  return (
<section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 space-y-6">
  
  {/* Filter Card */}
  <div className="bg-white rounded-2xl border border-[#B2DFDB]/70 p-5 sm:p-6 shadow-sm">
    
    {/* Section Header */}
    <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
      <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F4C5C]" />
      <h3 className="text-base sm:text-lg font-black text-[#0F3842]">Filter Transactions</h3>
    </div>

    {/* Filter Form */}
    <form onSubmit={handleApply} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* 1. Transaction Type */}
        <div>
          <label htmlFor="type" className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F3842] mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#5C8088]" />
            Type
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F3842] font-semibold text-xs focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        {/* 2. Start Date */}
        <div>
          <label htmlFor="startDate" className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F3842] mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#5C8088]" />
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F3842] font-semibold text-xs focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all"
          />
        </div>

        {/* 3. End Date */}
        <div>
          <label htmlFor="endDate" className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F3842] mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#5C8088]" />
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F3842] font-semibold text-xs focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all"
          />
        </div>

        {/* 4. Minimum Amount */}
        <div>
          <label htmlFor="minAmount" className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F3842] mb-1.5 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[#5C8088]" />
            Min Amount (₹)
          </label>
          <input
            type="number"
            id="minAmount"
            name="minAmount"
            placeholder="e.g. 500"
            min="0"
            value={filters.minAmount}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F3842] font-semibold text-xs focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all"
          />
        </div>

        {/* 5. Maximum Amount */}
        <div>
          <label htmlFor="maxAmount" className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F3842] mb-1.5 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[#5C8088]" />
            Max Amount (₹)
          </label>
          <input
            type="number"
            id="maxAmount"
            name="maxAmount"
            placeholder="e.g. 50000"
            min="0"
            value={filters.maxAmount}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F3842] font-semibold text-xs focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all"
          />
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Filters</span>
        </button>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#0F4C5C] hover:bg-[#0F3842] rounded-xl shadow-md shadow-[#0F4C5C]/20 transition-all active:scale-95 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Apply Filters</span>
        </button>
      </div>
    </form>

  </div>

  {/* Transactions List Area */}
  <div className="space-y-3">
    {transactions.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/50 p-10 text-center">
        <h3 className="text-base font-bold text-[#0F3842]">
          No Transactions Found
        </h3>
        <p className="mt-1 text-xs font-medium text-slate-400">
          Try changing your filters or add a new transaction.
        </p>
      </div>
    ) : (
      transactions.map((item) => (
        <div
          key={item._id || item._id}
          className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-[#B2DFDB] hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-[#0F3842] text-sm">
                {item.description}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {item.category}
              </p>
            </div>

            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                item.type === "income"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {item.type}
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">
              {new Date(item.transactionDate).toLocaleDateString("en-IN")}
            </span>

            <span
              className={`font-black text-sm ${
                item.type === "income" ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {item.type === "income" ? "+" : "-"} ₹{item.amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      ))
    )}
  </div>

</section>
  );
};

export default FilterSection;
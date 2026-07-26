import { AlertCircle, PlusCircle, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { FC, FormEvent, ChangeEvent } from "react";

export interface ITransaction {
  type: "income" | "expense";
  description: string;
  amount: string | number;
  category: string;
  transactionDate: string;
  date?: string 
}

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<ITransaction, "amount"> & { amount: number }) => void;
}

const CATEGORIES = {
  income: ["Salary", "Freelance", "Investment", "Business", "Other Income"],
  expense: [
    "Food & Dining",
    "Shopping",
    "Bills & Utilities",
    "Entertainment",
    "Transportation",
    "Healthcare",
    "Other Expense",
  ],
};

const initialFormState: ITransaction = {
  type: "expense",
  description: "",
  amount: "",
  category: CATEGORIES.expense[0],
  transactionDate: new Date().toISOString().split("T")[0],
};

export const AddTransactionForm: FC<AddTransactionFormProps> = ({
  onAddTransaction,
}) => {
  const [formData, setFormData] = useState<ITransaction>(initialFormState);

  const [errors, setErrors] = useState< Partial<Record<keyof ITransaction, string>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "type") {
      setFormData({...formData,
        type: value as "income" | "expense",
        category: CATEGORIES[value as "income" | "expense"][0],
      });
    } 
    else {
      setFormData({...formData,[name]: value,});
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ITransaction, string>> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = "Date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onAddTransaction({
      type: formData.type,
      description: formData.description.trim(),
      category: formData.category,
      amount: Number(formData.amount),
      transactionDate: formData.transactionDate,
    });

    handleReset();
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6 lg:my-8">
      <div className="bg-white rounded-2xl border border-[#B2DFDB]/70 p-4 sm:p-6 lg:p-8 shadow-sm">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-[#0F3842]">
              Add New Transaction
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#5C8088] mt-1">
              Fill details to record your income or expense
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {/* Transaction Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-xs font-bold uppercase tracking-wider text-[#0F3842] mb-2"
              >
                Type <span className="text-rose-500">*</span>
              </label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F3842] text-sm font-semibold focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-xs font-bold uppercase tracking-wider text-[#0F3842] mb-2"
              >
                Amount (₹) <span className="text-rose-500">*</span>
              </label>

              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="e.g. 5000"
                value={formData.amount}
                onChange={handleChange}
                min="1"
                step="any"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.amount
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-slate-200 bg-slate-50/50"
                } text-[#0F3842] text-sm font-semibold focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all`}
              />

              {errors.amount && (
                <p className="flex items-center gap-1 text-xs font-medium text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.amount}</span>
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-xs font-bold uppercase tracking-wider text-[#0F3842] mb-2"
              >
                Category <span className="text-rose-500">*</span>
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-[#0F3842] text-sm font-semibold focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all"
              >
                {CATEGORIES[formData.type].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-xs font-bold uppercase tracking-wider text-[#0F3842] mb-2"
              >
                Description <span className="text-rose-500">*</span>
              </label>

              <input
                type="text"
                id="description"
                name="description"
                placeholder="e.g. Monthly House Rent, Client Payment"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.description
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-slate-200 bg-slate-50/50"
                } text-[#0F3842] text-sm font-semibold focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all`}
              />

              {errors.description && (
                <p className="flex items-center gap-1 text-xs font-medium text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.description}</span>
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-xs font-bold uppercase tracking-wider text-[#0F3842] mb-2"
              >
                Transaction Date <span className="text-rose-500">*</span>
              </label>

              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.date
                    ? "border-rose-400 bg-rose-50/30"
                    : "border-slate-200 bg-slate-50/50"
                } text-[#0F3842] text-sm font-semibold focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all`}
              />

              {errors.date && (
                <p className="flex items-center gap-1 text-xs font-medium text-rose-600 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.date}</span>
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-100">

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Form</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#0F4C5C] hover:bg-[#0F3842] rounded-xl shadow-md shadow-[#0F4C5C]/20 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddTransactionForm;
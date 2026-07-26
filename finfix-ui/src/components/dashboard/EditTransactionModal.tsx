
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../utils/api';
import clientCatchError from '../../utils/clientCatchError';

interface Transaction {
  _id: string;
  userId?: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  transactionDate: string;
  createdAt?: string;
  updatedAt?: string;
}

// Props Interface
interface EditProps {
  isOpen: boolean;
  transaction: {
    _id: string;
    type: 'income' | 'expense';
    description: string;
    amount: number;
    category: string;
    transactionDate: string;
  } | null;
  onClose: () => void;
  onSave: (updatedTx: Transaction) => void;
  setIncrement: React.Dispatch<React.SetStateAction<number>>
}


const EditTransactionModal = ({ isOpen, transaction=null, onClose, onSave, setIncrement }: EditProps) => {
  // Form ki local state
  const [formData, setFormData] = useState<Transaction>({
    _id: "",
    type: "income",
    description: "",
    amount: 0,
    category: "",
    transactionDate: "",
 });

 
    useEffect(() => {
    if (transaction) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData(transaction);
    }
    }, [transaction]);

  // Agar modal open nahi hai, toh kuch mat dikhao
  if (!isOpen || !transaction) return null;

  // Input change handle karne ka simple function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'amount' ? Number(value) : value,
    });
  };

  // Submit Handler
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); 
    onClose();      

    try {
      const {data} = await api.patch(`/expense/${formData?._id}`, {
        type: formData.type,
        description: formData.description,
        amount: formData.amount,
        category: formData.category,
      })
      console.log(data);
      setIncrement((prev)=>prev+1)
      toast.success(data.message);
    } 
    catch (error) {
      return clientCatchError(error)
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        
        <h2 className="text-xl font-bold mb-4 text-slate-800">Edit Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Type */}
          <div>
            <label className="block text-xs font-bold mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-sm"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-sm"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg text-sm"
            />
          </div>



          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0F4C5C] text-white rounded-lg text-sm font-semibold"
            >
              Save
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default EditTransactionModal;

import { useState, type FC } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import EditTransactionModal from './EditTransactionModal';

export type TransactionType = 'income' | 'expense';

  interface ITransaction {
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

export interface IPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface TransactionListProps {
  loading: boolean;
  transactions: ITransaction[];
  pagination: IPaginationMeta;
  onPageChange: (page: number) => void;
  onEdit?: (transaction: ITransaction) => void;
  onDelete: (id: string) => void;
  setIncrement: React.Dispatch<React.SetStateAction<number>>
}

export const TransactionList: FC<TransactionListProps> = ({
  transactions = null,
  pagination,
  onPageChange,
  onDelete,
  setIncrement
}) => {
  const { currentPage, totalPages } = pagination;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const [isEdit, setIsEdit] = useState(false)
  const [editData, setEditData] = useState<ITransaction | null>(null)

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleEdit = (data:ITransaction)=>{
    setIsEdit(true)
    setEditData(data)
  }

  const handleEditHttp = async()=>{
    
      setIncrement((prev)=>prev+1)
  }



  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      {
        isEdit ? <EditTransactionModal isOpen={isEdit} transaction={editData} onClose={() => setIsEdit(false)} onSave={()=>handleEditHttp} setIncrement={setIncrement}/>
        :
        <div className="bg-white rounded-2xl border border-[#B2DFDB]/70 shadow-sm overflow-hidden">
        
        {/* Table Title */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[#0F3842]">Transaction History</h3>
            <p className="text-xs font-semibold text-[#5C8088] mt-0.5">
              View, edit, or delete your recorded transactions
            </p>
          </div>
          <span className="text-xs font-extrabold text-[#0F4C5C] bg-[#E6F4F1] px-3 py-1.5 rounded-xl border border-[#B2DFDB]/60">
            Total Records: {pagination.totalItems}
          </span>
        </div>

        {/* 6. Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-[#0F3842]">
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {transactions?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions?.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Description */}
                    <td className="py-4 px-6 text-[#0F3842] font-bold">
                      {tx.description}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-[#5C8088] font-bold">
                      {tx.category}
                    </td>

                    {/* Amount + Green/Red Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border ${
                          tx.type === 'income'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-[#5C8088]">
                      {new Date(tx.updatedAt).toLocaleString()}
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={()=>handleEdit(tx)}
                          title="Edit Transaction"
                          className="p-2 text-slate-600 hover:text-[#0F4C5C] hover:bg-[#E6F4F1] rounded-lg transition-all active:scale-95"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDelete(tx._id)}
                          title="Delete Transaction"
                          className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-all active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 7. Pagination Controls */}
        {totalPages > 0 && (
          <div className="p-4 sm:p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Page Info */}
            <div className="text-xs font-extrabold text-[#5C8088]">
              Page <span className="text-[#0F3842]">{currentPage}</span> of{' '}
              <span className="text-[#0F3842]">{totalPages}</span>
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-1.5">
              
              {/* Previous Button */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 text-xs font-extrabold rounded-xl border border-slate-200 bg-white text-[#0F3842] hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Number Buttons (e.g. 1 2 3 4) */}
              <div className="flex items-center gap-1">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-9 h-9 text-xs font-black rounded-xl transition-all active:scale-95 border ${
                      currentPage === page
                        ? 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-md shadow-[#0F4C5C]/20'
                        : 'bg-white text-[#0F3842] border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 text-xs font-extrabold rounded-xl border border-slate-200 bg-white text-[#0F3842] hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

      </div>
      }
    </section>
  );
};

export default TransactionList;
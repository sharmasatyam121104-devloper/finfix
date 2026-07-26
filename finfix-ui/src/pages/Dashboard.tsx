import  { useState, useEffect } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import SummaryCards from '../components/dashboard/SummaryCards';
import AddTransactionForm from '../components/dashboard/AddTransactionForm';
import FilterSection from '../components/dashboard/FilterSection';
import SortingSection from '../components/dashboard/SortingSection';
import TransactionList from '../components/dashboard/TransactionList';
import type { IPaginationMeta } from '../components/dashboard/TransactionList';
import api from '../utils/api';
import clientCatchError from '../utils/clientCatchError';
import { toast } from 'sonner';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import CategoryPieChart from '../components/analytics/CategoryPieChart';

interface SummaryCardsProps {
  balance?: number;
  totalIncome?: number;
  totalExpense?: number;
}

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


export interface CreateTransaction {
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  transactionDate: string;
}

const DashboardPage = () => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [increment, setIncrement] = useState(1)

  const [pagination, setPagination] = useState<IPaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [SummaryCardsPropsData, setSummaryCardsPropsData] = useState<SummaryCardsProps>({});


useEffect(() => {
    const SummaryCardsData = async()=>{
    try {
      const {data} = await api.get('/expense/stats');
      setSummaryCardsPropsData(data);
    } 
    catch (error) {
      return clientCatchError(error);
    }
  }
  SummaryCardsData();
},[]);

  //Fetch Transactions Data for table
  useEffect(()=>{
    const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/expense", {
        params: {
          page: currentPage,
          limit: pagination.itemsPerPage,
        },
      });
      setTransactions(data.transactions)
      setPagination({
        currentPage: data.page,
        totalPages: data.totalPages,
        totalItems: data.total,
        itemsPerPage: data.limit,
      });
    } catch (err) {
      clientCatchError(err);
    } finally {
      setLoading(false);
    }
  };
  fetchTransactions();
  },[currentPage, pagination.itemsPerPage, increment]);

  // 2. Add New Transaction Handler
    const handleAddTransaction = async (formData: CreateTransaction) => {
      try {
        await api.post("/expense", formData);

        toast.success("Transaction Added");
        setIncrement((prev)=>prev+1)

      } catch (error) {
        return clientCatchError(error);
      }
    };
    // 6. Delete Handler
    const handleDeleteTransaction = async (id: string) => {
      if (!window.confirm("Delete Transaction?")) return;

      try {
        await api.delete(`/expense/${id}`);

        toast.success("Deleted");
        setIncrement((prev)=>prev+1)
      } 
      catch(err) {
        return clientCatchError(err);
      }
    };





return (
  <div className="min-h-screen bg-[#E6F4F1]">
    {/* Header */}
    <DashboardHeader userName="Rahul Sharma" />

    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Summary Cards */}
        <SummaryCards {...SummaryCardsPropsData} />
            <div className="xl:col-span-2">
        <AnalyticsChart />
    </div>

    <div>
        <CategoryPieChart />
    </div>
        {/* Add Transaction */}
        <AddTransactionForm onAddTransaction={handleAddTransaction} />

        {/* Filter & Sorting */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FilterSection />
          <SortingSection />
        </div>

        {/* Transaction List */}
        <TransactionList
          loading={loading}
          setIncrement={setIncrement}
          transactions={transactions}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </main>
  </div>
);
};

export default DashboardPage;
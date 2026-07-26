import { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface CategoryData {
  category: string;
  total: number;
  transactions: number;
}

const COLORS = [
  "#0F4C5C",
  "#14B8A6",
  "#22C55E",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

const CategoryPieChart = () => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryAnalytics = async () => {
      try {
        setLoading(true);

        const {data} = await api.get("/expense/category-analytics");

        setData(data.data ?? []);
        console.log(data);
      } catch (error) {
        console.error(error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAnalytics();
  }, []);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-cyan-100">
          <PieChartIcon className="w-5 h-5 text-cyan-700" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Expense Categories
          </h2>

          <p className="text-sm text-slate-500">
            Expense distribution
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-87.5 flex items-center justify-center text-slate-500">
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div className="h-87.5 flex flex-col items-center justify-center text-center">
          <PieChartIcon className="w-14 h-14 text-slate-300 mb-3" />

          <h3 className="font-semibold text-slate-700">
            No Expense Data
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Add some expenses to see category distribution.
          </p>
        </div>
      ) : (
        <div className="w-full h-87.5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Tooltip
                formatter={(value) => [`₹${value ?? 0}`, "Amount"]}
                />

              <Legend />

              <Pie
                data={data}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60}
                paddingAngle={3}
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default CategoryPieChart;
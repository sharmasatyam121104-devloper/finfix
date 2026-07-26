import { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface GraphData {
  label: string;
  income: number;
  expense: number;
}

const AnalyticsChart = () => {
  const [graph, setGraph] = useState<GraphData[]>([]);
  const [range, setRange] = useState("7d");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/expense/analytics", {
          params: { range },
        });

        setGraph(data.graph ?? []);
      } catch (error) {
        console.error(error);
        setGraph([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [range]);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Income vs Expense
            </h2>

            <p className="text-sm text-slate-500">
              Financial trend over time
            </p>
          </div>
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-emerald-500"
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last 1 Year</option>
        </select>
      </div>

      {loading ? (
        <div className="h-[380px] flex items-center justify-center text-slate-500">
          Loading analytics...
        </div>
      ) : graph.length < 2 ? (
        <div className="h-[380px] flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-16 h-16 text-slate-300 mb-4" />

          <h3 className="text-xl font-semibold text-slate-700">
            Insufficient Data
          </h3>

          <p className="text-sm text-slate-500 max-w-md mt-2">
            Add transactions across multiple dates to generate meaningful
            analytics and visualize your financial trends.
          </p>
        </div>
      ) : (
        <div className="w-full h-[350px] sm:h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={graph}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="incomeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#22c55e"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="95%"
                    stopColor="#22c55e"
                    stopOpacity={0.03}
                  />
                </linearGradient>

                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#ef4444"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="95%"
                    stopColor="#ef4444"
                    stopOpacity={0.03}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 8px 20px rgba(0,0,0,.08)",
                }}
              />

              <Legend />

              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#22c55e"
                fill="url(#incomeGradient)"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />

              <Area
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#ef4444"
                fill="url(#expenseGradient)"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default AnalyticsChart;
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { BACKEND_URL } from "../utils/config";

const RepeatCustomerChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("monthly");
  const [repeatCustomerData, setRepeatCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepeatCustomerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/repeatCustomers/repeat-customers/${selectedTimeRange}`
        );

        const transformedData = response.data.map((item) => ({
          time: item.timeFrame,
          customerCount: item.count,
          email: item.email,
        }));

        transformedData.sort((a, b) => new Date(a.time) - new Date(b.time));

        setRepeatCustomerData(transformedData);
      } catch (error) {
        setError("Error fetching repeat customer data");
        console.error("Error fetching repeat customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepeatCustomerData();
  }, [selectedTimeRange]);

  const CustomTooltip = ({ payload, label }) => {
    if (!payload || payload.length === 0) return null;

    const { customerCount, email } = payload[0].payload;

    return (
      <div className="bg-gray-800 p-2 rounded-md border border-gray-700">
        <p className="text-white font-semibold">{label}</p>
        <p className="text-gray-300">Count: {customerCount}</p>
        <p className="text-gray-300">Email: {email}</p>
      </div>
    );
  };

  return (
    <motion.div
      className="bg-gray-800 p-10 w-full h-full bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Repeat Customers Distribution
        </h2>

        <select
          className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 
                    focus:ring-blue-500"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="w-full h-80">
        {loading ? (
          <p className="text-gray-100">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ResponsiveContainer>
            <BarChart data={repeatCustomerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                content={<CustomTooltip />}
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Bar dataKey="customerCount" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default RepeatCustomerChart;

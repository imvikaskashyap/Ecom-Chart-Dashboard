import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { BACKEND_URL } from "../utils/config";

const NewCustomersChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("monthly");
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true); 
      setError(null);  
      try {
        const response = await axios.get(
          `${BACKEND_URL}/customer/${selectedTimeRange}`
        );
        console.log(response);
        setCustomerData(
          response.data.map((item) => ({
            time: item._id,
            newCustomers: item.newCustomers,
          }))
        );
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setError("Error fetching customer data");  
      } finally {
        setLoading(false);  
      }
    };
    fetchCustomerData();
  }, [selectedTimeRange]);

  return (
    <motion.div
      className="bg-gray-800 p-10 w-full h-full bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl  border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-center text-gray-100">
          New Customers Over Time
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
            <AreaChart data={customerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(31, 41, 55, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Area
                type="monotone"
                dataKey="newCustomers"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default NewCustomersChart;

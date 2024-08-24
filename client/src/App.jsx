import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SalesOverviewChart from "./pages/SalesOverviewChart";
import SalesGrowthChart from "./pages/SalesGrowthChart";
import NewCustomersChart from "./pages/NewCustomersChart";
import RepeatCustomerChart from "./pages/RepeatCustomerChart";
import CityMap from "./pages/CityMap";

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <Sidebar />
      <Routes>
        <Route path="/" element={<SalesOverviewChart />} />
        <Route path="/sales-growth" element={<SalesGrowthChart />} />
        <Route path="/new-customers" element={<NewCustomersChart />} />
        <Route path="/repeat-customers" element={<RepeatCustomerChart />} />
        <Route path="/city-map" element={<CityMap />} />
      </Routes>
    </div>
  );
}

export default App;

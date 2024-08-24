import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SalesOverviewChart from "./pages/SalesOverviewChart";
import SalesGrowthChart from "./pages/SalesGrowthChart";
import NewCustomersChart from "./pages/NewCustomersChart";
import RepeatCustomerChart from "./pages/RepeatCustomerChart";
import CityMap from "./pages/CityMap";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden relative">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
        {/* Backdrop Blur applied only to the gradient background */}
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Sidebar (z-index increased to overlay on top of background) */}
      <Sidebar />

      {/* Content Wrapper */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sales" element={<SalesOverviewChart />} />
          <Route path="/sales-growth" element={<SalesGrowthChart />} />
          <Route path="/new-customers" element={<NewCustomersChart />} />
          <Route path="/repeat-customers" element={<RepeatCustomerChart />} />
          <Route path="/city-map" element={<CityMap />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

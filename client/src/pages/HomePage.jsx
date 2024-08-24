import { motion } from 'framer-motion';

const HomePage = () => {
  return (
    <motion.div
      className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Our Dashboard</h1>
      <p className="text-lg text-center max-w-xl">
        We are thrilled to have you here! Please note that our backend services are hosted on a free platform provided by Render.
        As a result, API responses might be slightly delayed. We kindly ask for your patience while the chart data is being fetched. 
        It may take about 1 to 2 minutes for the data to load.
      </p>
      <p className="text-lg text-center mt-4">Thank you for your understanding and enjoy exploring our dashboard!</p>
    </motion.div>
  );
};

export default HomePage;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./db/db.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://ecom-chart-dashboard-1.onrender.com",
      "http://localhost:5173",
      "*",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

dbConnect();

// Routes
app.use("/api/v1", router);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

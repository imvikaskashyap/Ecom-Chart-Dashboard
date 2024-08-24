import express from "express";
import { getSalesGrowthRate } from "../controllers/salesGrowthController.js";

const salesGrowthRoutes= express.Router();

salesGrowthRoutes.get('/sales-growth-rate/:interval', getSalesGrowthRate);

export default salesGrowthRoutes;

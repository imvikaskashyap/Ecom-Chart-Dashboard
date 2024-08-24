import express from "express";
import { getSalesData } from "../controllers/salesController.js";

const salesRoutes = express.Router();


salesRoutes.get("/:interval", getSalesData);

export default salesRoutes;

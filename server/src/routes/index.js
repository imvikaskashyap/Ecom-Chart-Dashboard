import express from "express";
import salesRoutes from "./salesRoutes.js";
import customerRoutes from "./customerRoutes.js";
import repeatCustomersRoutes from "./repeatCustomersRoutes.js";
import salesGrowthRoutes from "./salesGrowthRoutes.js";

const router = express.Router();
router.use("/sales",salesRoutes)
router.use("/customer",customerRoutes)
router.use("/repeatCustomers",repeatCustomersRoutes)
router.use("/growth",salesGrowthRoutes)
export default router
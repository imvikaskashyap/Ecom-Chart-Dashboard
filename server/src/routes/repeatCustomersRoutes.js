import express from 'express';
import { getRepeatCustomers } from '../controllers/getRepeatCustomers.js';


const repeatCustomersRoutes = express.Router();


repeatCustomersRoutes.get('/repeat-customers/:interval', getRepeatCustomers);

export default repeatCustomersRoutes;

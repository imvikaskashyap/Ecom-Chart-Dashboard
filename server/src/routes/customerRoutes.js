import express from 'express';
import { getNewCustomersData } from '../controllers/newCustomersController.js';
import { getCustomerDistributionByCity } from '../controllers/customerDistributionController.js';

const customerRoutes = express.Router();


customerRoutes.get('/:interval', getNewCustomersData);

customerRoutes.get('/customer-distribution/cities', getCustomerDistributionByCity);




export default customerRoutes;

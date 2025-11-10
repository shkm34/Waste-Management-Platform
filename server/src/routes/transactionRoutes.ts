
import express from 'express';
import {
    getMyTransactions,
    getWalletBalance,
} from '../controllers/transactionController';
import { protect, authorize } from '../middleware/authMiddleware';
import { USER_ROLES } from '../config/constants';

const router = express.Router();

// Customer only routes
router.get('/my-transactions', protect, authorize([USER_ROLES.CUSTOMER]), getMyTransactions);
router.get('/balance', protect, authorize([USER_ROLES.CUSTOMER]), getWalletBalance);

export default router;
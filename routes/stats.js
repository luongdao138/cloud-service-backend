import express from 'express';
import statsController from '../controllers/stats.js';
const router = express.Router();

router.route('/filters').get(statsController.getFilters);
router.route('/').get(statsController.getStats);

export default router;

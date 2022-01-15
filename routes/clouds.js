import express from 'express';
import cloudController from '../controllers/clouds.js';

const router = express.Router();

router.route('/').get(cloudController.getClouds);
router.route('/:id/reviews').get(cloudController.getCloudReviews);
router.route('/:id').get(cloudController.getCloud);

export default router;

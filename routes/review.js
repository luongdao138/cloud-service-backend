import express from 'express';
import reviewController from '../controllers/review.js';
import verifyUser from '../middlewares/verifyUser.js';

const router = express.Router();
router.use(verifyUser);

router
  .route('/:id')
  .get(reviewController.getReviewDetail)
  .delete(reviewController.deleteReview)
  .put(reviewController.updateReview);
router.route('/').get(reviewController.getReviewsOfUser).post(reviewController.addReview);

export default router;

import { Router } from 'express';
import { ReviewController } from '../controllers/reviewControllers';

const router = Router();
const reviewController = new ReviewController();

router.post('/review', reviewController.submitReview.bind(reviewController));
router.get('/reviews', reviewController.getReviewHistory.bind(reviewController));
router.get('/test-connection', reviewController.testConnection.bind(reviewController)); // New test endpoint

export { router as reviewRoutes };
import express from 'express';
import locationController from '../controllers/location.js';
import verifyUser from '../middlewares/verifyUser.js';

const router = express.Router();

router.use(verifyUser);

router.get('/provinces', locationController.getProvinces);
router.get('/districts', locationController.getDistricts);
router.get('/wards', locationController.getWards);

export default router;

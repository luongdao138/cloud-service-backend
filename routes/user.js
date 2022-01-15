import express from 'express';
import userController from '../controllers/user.js';
import verifyUser from '../middlewares/verifyUser.js';
import multer from 'multer';

const router = express.Router();

router.use(verifyUser);

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/getUser', userController.getUser);
router.put('/:id/image', upload.single('image'), userController.uploadAvatar);
router.put('/:id', userController.updateUser);

export default router;

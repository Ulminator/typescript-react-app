import * as express from 'express';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

export default router;
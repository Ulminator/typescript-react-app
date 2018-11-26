import { Router, Request, Response } from 'express';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

router.get('/health', (req: Request, res: Response) => {
  res.status(200).send({ status: 'UP' });
});

export default router;
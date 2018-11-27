import { Router, Request, Response } from 'express';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
import commentRoutes from './commentRoutes';
import replyRoutes from './replyRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/replies', replyRoutes);

router.get('/health', (req: Request, res: Response) => {
  res.status(200).send({ status: 'UP' });
});

export default router;

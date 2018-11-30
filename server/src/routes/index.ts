import { Router, Request, Response } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import userRoutes from './userRoutes';
import postRoutes from './postRoutes';
import commentRoutes from './commentRoutes';
import replyRoutes from './replyRoutes';

const swaggerDoc = require('../../openapi/swagger.json');
if (process.env.NODE_ENV === 'production') {
  const { GAE_SERVICE, GOOGLE_CLOUD_PROJECT } = process.env;
  swaggerDoc.host = `${GAE_SERVICE}-dot-${GOOGLE_CLOUD_PROJECT}.appspot.com`;
} else {
  swaggerDoc.host = '';
  swaggerDoc.schemes = ['http'];
}

const router = Router();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/replies', replyRoutes);

router.get('/health', (req: Request, res: Response) => {
  res.status(200).send({ status: 'UP' });
});

export default router;

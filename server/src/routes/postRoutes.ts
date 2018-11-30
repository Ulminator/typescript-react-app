import * as express from 'express';
import * as postController from '../controller/postController';

const router = express.Router();

router.get('/', (req, res) => postController.getPosts(req, res));

router.get('/:postId', (req, res) => postController.getPostById(req, res));

router.post('/:postId/comment/', (req, res) => postController.postPostComment(req, res));

export default router;

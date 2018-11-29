import * as express from 'express';
import * as postController from '../controller/postController';

const router = express.Router();

// /api/posts?include=id,title,image_id,created_at
router.get('/', (req, res) => postController.getPosts(req, res));

// /api/posts/1?expand=comments&include=id,title,image_id,created_at
router.get('/:postId', (req, res) => postController.getPostById(req, res));

// /api/posts/1/comment
router.post('/:postId/comment/', (req, res) => postController.postPostComment(req, res));

export default router;

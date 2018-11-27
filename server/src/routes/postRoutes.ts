import * as express from 'express';
import * as postController from '../controller/postController';

const router = express.Router();

// /api/posts?include=id,title,image_id,created_at
router.get('/', (req, res) => postController.getPosts(req, res));
router.get('/:postId', (req, res) => postController.getPostById(req, res));

// /api/posts/1/comment
router.post('/:postId/comment/', (req, res) => postController.postPostComment(req, res));

// /api/posts/1/comments - get all comments

export default router;

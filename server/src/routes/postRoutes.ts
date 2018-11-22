import * as express from 'express';
import * as postController from '../controller/postController';

const router = express.Router();

router.get('/', (req, res) => postController.getAllPostTitles(req, res));

router.get('/:postId', (req, res) => postController.getPostById(req, res));

router.post('/new', (req, res) => postController.createNewPost(req, res));

router.post('/:postId/comment/new', (req, res) => postController.createNewComment(req, res));

router.post('/:postId/comment/:commentId/reply/new', (req, res) => postController.createNewReply(req, res));

export default router;
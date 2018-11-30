import * as express from 'express';
import * as commentController from '../controller/commentController';

const router = express.Router();

router.get('/:commentId', (req, res) => commentController.getCommentById(req, res));

router.post('/:commentId/reply/', (req, res) => commentController.postCommentReply(req, res));

export default router;

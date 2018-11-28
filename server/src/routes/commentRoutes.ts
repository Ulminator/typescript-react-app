import * as express from 'express';
import * as commentController from '../controller/commentController';

const router = express.Router();

// /api/comments/3?expand=user,replies&incude=id,content,created_at
router.get('/:commentId', (req, res) => commentController.getCommentById(req, res));

// /api/comments/1/reply
router.post('/:commentId/reply/', (req, res) => commentController.postCommentReply(req, res));

export default router;

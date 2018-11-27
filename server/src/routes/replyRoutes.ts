import * as express from 'express';
import * as replyController from '../controller/replyController';

const router = express.Router();

router.get('/:replyId', (req, res) => replyController.getReplyById(req, res));

export default router;

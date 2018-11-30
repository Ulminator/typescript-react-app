import * as express from 'express';
import * as userController from '../controller/userController';

const router = express.Router();

router.post('/:userId/post', (req, res) => userController.postUsersPost(req, res));

export default router;

import * as express from 'express';
import * as userController from '../controller/userController';

const router = express.Router();

// /:userId/posts?expand=posts,comments,comments.replies&include=id,username,email,created_at - get

// localhost:8080/api/users/1/post/
router.post('/:userId/post', (req, res) => userController.postUsersPost(req, res));

export default router;

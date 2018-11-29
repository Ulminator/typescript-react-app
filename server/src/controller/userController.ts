import { Request, Response } from 'express';
import execute from '../pg/execute';
import * as queries from '../pg/queries';

export async function postUsersPost(req: Request, res: Response) {

  const { userId } = req.params;

  const { title, imageId, content }: { title: string, imageId: string, content: string } = req.body;

  try {
    await execute('BEGIN');
    const { rows: pRows } = await execute(queries.postUsersPost, [userId, title, imageId]);
    const { id: postId, created_at: pCreatedAt } = pRows[0];
    const { rows: cRows } = await execute(queries.postPostsComment, [postId, userId, content]);
    const { id: commentId, created_at: cCreatedAt } = cRows[0];

    execute('COMMIT').then(() => {
      const body: any = {};

      body.post = { title, imageId, id: postId, createdAt: pCreatedAt };
      body.post._links = {
        self: `/api/posts/${postId}`,
        user: `/api/users/${userId}`,
      };
      body.post.comments = [{ content, id: commentId, createdAt: cCreatedAt }];
      body.post.comments[0]._links = {
        self: `/api/comments/${commentId}`,
        user: `/api/users/${userId}`,
      };

      res.status(201).send(body);
    });
  } catch (err) {
    console.log(err);
    execute('ROLLBACK').then(() => res.status(500).send({}));
  }
}

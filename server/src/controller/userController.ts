import { Request, Response } from 'express';
import pool from '../pg/pool';
import * as queries from '../pg/queries';

export async function postUsersPost(req: Request, res: Response) {

  const { userId } = req.params;

  const { title, imageId, content }: { title: string, imageId: string, content: string } = req.body;

  try {
    await pool.query('BEGIN');
    const { rows: pRows } = await pool.query(queries.postUsersPost, [userId, title, imageId]);
    const { id: postId, created_at: pCreatedAt } = pRows[0];
    const { rows: cRows } = await pool.query(queries.postPostsComment, [postId, userId, content]);
    const { id: commentId, created_at: cCreatedAt } = cRows[0];

    pool.query('COMMIT').then(() => {
      const body: any = {};
      body.comment = { content, id: commentId, createdAt: cCreatedAt };
      body.comment._links = {
        self: `/api/comments/${commentId}`,
        post: `/api/posts/${postId}`,
        // replies: `/api/comments/${commentId}/replies`,
        user: `/api/users/${userId}`,
      };

      body.post = { title, imageId, id: postId, createdAt: pCreatedAt };
      body.post._links = {
        self: `/api/posts/${postId}`,
        // comments: `/api/posts/${postId}/comments`,
        user: `/api/users/${userId}`,
      };
      res.status(201).send(body);
    });
  } catch (err) {
    console.log(err);
    pool.query('ROLLBACK').then(() => res.status(500).send({}));
  }
}

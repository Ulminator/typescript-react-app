import { Request, Response } from 'express';
import client from '../pg/client';
import * as queries from '../pg/queries';

export async function postUsersPost(req: Request, res: Response) {

  const { userId: userIdString }: { userId: string } = req.params;
  const userId = parseInt(userIdString);

  const { title, imageId, content }: { title: string, imageId: string, content: string } = req.body;

  try {
    await client.query('BEGIN')
    const { rows: pRows } = await client.query(queries.postUsersPost, [userId, title, imageId]);
    const { id: postId, created_at: pCreatedAt } = pRows[0];
    const { rows: cRows } = await client.query(queries.postPostsComment, [postId, userId, content]);
    const { id: commentId, created_at: cCreatedAt } = cRows[0];

    client.query('COMMIT').then(() => {
      const link = `/api/posts/${postId}`;
      res.status(201).set('Location', link).send({
        post: { postId, userId, title, imageId, createdAt: pCreatedAt, link },
        comment: { commentId ,postId, userId, content, createdAt: cCreatedAt }
      })
    });
  } catch (err) {
    console.log(err);
    client.query('ROLLBACK').then(() => res.status(500).send({}));
  }
};

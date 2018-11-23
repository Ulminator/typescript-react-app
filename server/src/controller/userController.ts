import { Request, Response } from 'express';
import client from '../pg/client';
import * as queries from '../pg/queries';

export async function postUsersPost(req: Request, res: Response) {

  const { userId } = req.params;
  const { title, imageId, content } = req.body;

  try {
    const { rows } = await client.query(queries.postUsersPost, [userId, title, imageId]);
    const { id: postId } = rows[0];

    client.query(queries.postPostsComment, [postId, userId, content]).then(() => res.status(200).send());
  } catch (err) {
    console.log(err);
    res.status(500).send({});
  }
};

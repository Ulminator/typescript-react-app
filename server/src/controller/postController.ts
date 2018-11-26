import { Request, Response } from 'express';
import client from '../pg/client';
import * as queries from '../pg/queries';
import generateInClause from '../util/generateInClause';

export async function getPosts(_req: Request, res: Response) {
  const { rows } = await client.query(queries.getPosts);
  res.send(rows);
};

export async function getPostById(req: Request, res: Response) {

  const { postId } = req.params;
  
  const { rows: pRows } = await client.query(queries.getPostById, [postId]);
  const { rows: cRows } = await client.query(queries.getCommentsAndRepliesByPostId, [postId]);

  let user_ids = new Set();
  let { comments }: { comments: Comment[] } = cRows[0];

  if (comments !== null) {
    comments.forEach(comment => {
      if (!user_ids.has(comment.user_id)) user_ids.add(comment.user_id)
      comment.replies.forEach(reply => {
        if (!user_ids.has(reply.user_id)) user_ids.add(reply.user_id)
      });
    });
  
    const { rows: uRows }: { rows: Row[] } = await client.query(queries.getUsernamesById + generateInClause([...user_ids]), [...user_ids]);
    const idUsernameMap: IHash = {};
    uRows.forEach(row => idUsernameMap[row.id] = row.username);
  
    comments.forEach(comment => {
      comment.username = idUsernameMap[comment.user_id];
      comment.replies.forEach(reply => {
        reply.username = idUsernameMap[reply.user_id];
      });
    });
  } else {
    comments = [];
  }

  res.send({ id: pRows[0].id, userId: pRows[0].user_id, title: pRows[0].title, imageId: pRows[0].image_id, createdAt: pRows[0].created_at, comments });
};

interface Row { id: string, username: string }
interface IHash { [details: string]: string};
interface Reply { reply_id: number, user_id: string, content: string, created_at: Date, username: string }
interface Comment { comment_id: number, user_id: string, content: string, created_at: Date, replies: Reply[], username: string }

export async function getPostsCommentById(req: Request, res: Response) {
  const { commentId } = req.params;
  const { rows } = await client.query(queries.getPostsCommentById, [commentId]);
  res.send(rows[0]);
}

export async function postPostsComment(req: Request, res: Response) {

  const { postId } = req.params;
  const { userId, content } = req.body;

  client.query(queries.postPostsComment, [postId, userId, content])
        .then((result) => {
          const { id, created_at: createdAt } = result.rows[0];
          const link = `/api/posts/${postId}/comment/${id}`;
          res.status(200).send({
            comment: { id, postId, userId, content, createdAt, link }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({});
        });
};

export async function getPostsCommentsReplyById(req: Request, res: Response) {
  const { replyId } = req.params;
  const { rows } = await client.query(queries.getPostsCommentsReplyById, [replyId]);
  res.send(rows[0]);
}

export async function postsPostsCommentsReply(req: Request, res: Response) {

  const { postId, commentId } = req.params;
  const { userId, content } = req.body;

  client.query(queries.postsPostsCommentsReply, [commentId, userId, content])
        .then((result) => {
          const { id, created_at: createdAt } = result.rows[0];
          const link = `/api/posts/${postId}/comment/${commentId}/reply/${id}`;
          res.status(200).send({
            reply: { id, userId, content, createdAt, link }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send({});
        });
};

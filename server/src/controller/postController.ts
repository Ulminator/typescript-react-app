import { Request, Response } from 'express';
import * as _ from 'lodash';
import pool from '../pg/pool';
import * as queries from '../pg/queries';
import generateInClause from '../util/generateInClause';
import formatJson from '../util/formatJson';
import removeAndCamelCase from '../util/removeAndCamelCase';

export async function getPosts(req: Request, res: Response) {

  const { include } = req.query;

  const { rows } = await pool.query(queries.getPosts);

  if (rows.length === 0) {
    res.status(404).send([]);
  } else {
    const posts: any[] = [];
    const omittedArr = ['post_id', 'user_id'];

    rows.forEach((row) => {

      const post = formatJson(row, include, omittedArr);

      post._links = {
        self: `/api/posts/${row.id}`,
        user: `/api/users/${row.user_id}`,
      };

      posts.push(post);
    });

    const body: any = {};
    body.posts = posts;
    body._links = { self: '/api/posts' };

    res.send(body);
  }

}

function generateUser(row: { user_id: string; username: string }) {
  return {
    id: row.user_id,
    username: row.username,
    _links: {
      self: `/api/users/${row.user_id}`,
      posts: `/users/${row.user_id}/posts`,
      comments: `/users/${row.user_id}/comments`,
      replies: `/users/${row.user_id}/replies`,
    },
  };
}

export async function getPostById(req: Request, res: Response) {

  const { postId } = req.params;
  const { include, expand } = req.query;

  const { rows } = await pool.query(queries.getPostByPostId, [postId]);

  if (rows.length === 0) {
    res.status(404).send({});
  } else {
    const body: any = { _expandable: { comments: `/api/posts/${postId}/comments` } };
    const row = rows[0];

    const omittedArr = ['user_id', 'username'];
    const post = formatJson(row, include, omittedArr);

    post.user = generateUser(row);

    if (expand !== undefined) {
      const entries = expand.split(',');
      for (const entry of entries) {
        if (entry === 'comments') {
          delete body._expandable;

          const { rows: commentRows } = await pool.query(queries.getCommentsByPostId, [postId]);
          if (commentRows.length === 0) {
            post.comments = [];
          } else {

            const comments: any[] = [];
            const commentIds: number[] = [];
            for (const row of commentRows) {
              const comment = removeAndCamelCase(row, omittedArr);
              comment.user = generateUser(row);

              comments.push(comment);
              commentIds.push(row.id);
            }

            let query = queries.getRepliesByCommentIds + generateInClause(commentIds);
            query += queries.orderByCommentIdAndCreatedAt;

            const { rows: replyRows } = await pool.query(query, commentIds);

            while (replyRows.length > 0) {
              const row = replyRows.shift();
              for (const comment of comments) {
                if (comment.id !== row.comment_id && comment.replies === undefined) {
                  comment.replies = [];
                  break;
                }
                if (comment.id === row.comment_id) {
                  if (comment.replies === undefined) { comment.replies = []; }
                  const omitted = _.omit(row, omittedArr);
                  const reply = _.mapKeys(omitted, (value, key) => _.camelCase(key));
                  reply.user = generateUser(row);
                  comment.replies.push(reply);
                }
              }
            }
            post.comments = comments;
          }
        }
      }
    }
    post._links = { self: `/api/posts/${postId}` };

    body.post = post;
    res.status(200).send(body);
  }
}

export async function postPostComment(req: Request, res: Response) {

  const { postId } = req.params;
  const { userId, content } = req.body;

  pool.query(queries.postPostsComment, [postId, userId, content])
        .then((result) => {
          const body: any = {};
          const { id, created_at: createdAt } = result.rows[0];
          body.comment = { id, content, createdAt };
          body._links = {
            self: `/api/comments/${id}`,
            post: `/api/posts/${postId}`,
            user: `/api/users/${userId}`,
          };
          res.status(200).send(body);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({});
        });
}

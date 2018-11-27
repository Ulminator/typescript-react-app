import { Request, Response } from 'express';
import * as _ from 'lodash';
import pool from '../pg/pool';
import * as queries from '../pg/queries';
import formatJson from '../util/formatJson';

// expand the users in the replies?
// http://localhost:8080/api/comments/3?expand=user,replies&incude=id,content,created_at
export async function getCommentById(req: Request, res: Response) {

  const { commentId } = req.params;
  const { include, expand } = req.query;

  const { rows } = await pool.query(queries.getCommentById, [commentId]);

  if (rows.length === 0) {
    res.status(404).send({});
  } else {
    const body: any = {};
    const row = rows[0];

    const omittedArr = ['post_id', 'user_id'];
    const comment = formatJson(row, include, omittedArr);

    body._expandable = {
      user: `/api/users/${row.user_id}`,
      replies: `/api/comments/${row.id}/replies`,
    };
    if (expand !== undefined) {
      const entries = expand.split(',');
      for (const entry of entries) {
        switch (entry) {
          case 'user':
            const { rows } = await pool.query(queries.getUserById, [row.user_id]);
            const camelCaseUser = _.mapKeys(rows[0], (value, key) => _.camelCase(key));
            // camelCaseUser._links = {
            //   self: `/users/${rows[0].id}`,
            //   posts: `users/${rows[0].id}/posts`,
            //   comments: `/users/${rows[0].id}/comments`,
            //   replies: `/users/${rows[0].id}/replies`,
            // };
            comment.user = camelCaseUser;
            delete body._expandable.user;
            break;
          case 'replies': {
            const { rows } = await pool.query(queries.getRepliesByCommentId, [row.id]);
            const replies: any[] = [];
            rows.forEach((row) => {
              // const omittedArr = ['comment_id', 'user_id'];
              // const reply = removeFieldsAndCamelCase(row, omittedArr);
              const omitted = _.omit(row, ['comment_id', 'user_id']);
              const reply = _.mapKeys(omitted, (value, key) => _.camelCase(key));
              reply._links = {
                self: `/replies/${row.id}`,
                comment: `/comments/${row.comment_id}/`,
                user: `/users/${row.user_id}`,
              };
              replies.push(reply);
            });
            comment.replies = replies;
            delete body._expandable.replies;
            break;
          }
        }
      }
    }

    if (Object.keys(body._expandable).length === 0) {
      delete body._expandable;
    }

    body.comment = comment;
    body._links = {
      self: `/api/comments/${row.id}`,
      post: `/api/posts/${row.post_id}`,
    };

    res.status(200).send(body);
  }
}

export async function postCommentReply(req: Request, res: Response) {

  const { commentId } = req.params;
  const { userId, content } = req.body;

  pool.query(queries.postCommentsReply, [commentId, userId, content])
      .then((result) => {
        const body: any = {};
        const { id, created_at: createdAt } = result.rows[0];
        body.reply = { id, content, createdAt };
        body._links = {
          self: `/api/replies/${id}`,
          comment: `/api/comments/${commentId}`,
          user: `/api/users/${userId}`,
        };
        res.status(200).send(body);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({});
      });
}

import { Request, Response } from 'express';
import * as _ from 'lodash';
import pool from '../pg/pool';
import * as queries from '../pg/queries';
import formatJson from '../util/formatJson';

export async function getReplyById(req: Request, res: Response) {

  const { replyId } = req.params;
  const { include, expand } = req.query;

  const { rows } = await pool.query(queries.getReplyById, [replyId]);

  if (rows.length === 0) {
    res.status(404).send({});
  } else {
    const body: any = {};
    const row = rows[0];

    const omittedArr = ['comment_id', 'user_id'];
    const reply = formatJson(row, include, omittedArr);

    body._expandable = {
      user: `/api/users/${row.user_id}`,
    };
    if (expand !== undefined) {
      const entries = expand.split(',');
      for (const entry of entries) {
        if (entry === 'user') {
          const { rows } = await pool.query(queries.getUserById, [row.user_id]);
          const camelCaseUser = _.mapKeys(rows[0], (value, key) => _.camelCase(key));
          camelCaseUser._links = {
            self: `/users/${rows[0].id}`,
            posts: `/users/${rows[0].id}/posts`,
            comments: `/users/${rows[0].id}/comments`,
            replies: `/users/${rows[0].id}/replies`,
          };
          reply.user = camelCaseUser;
          delete body._expandable.user;
        }
      }
    }

    if (Object.keys(body._expandable).length === 0) {
      delete body._expandable;
    }

    body.reply = reply;
    body._links = {
      self: `/api/replies/${row.id}`,
      comment: `/api/comments/${row.comment_id}`,
    };
    res.status(200).send(body);
  }
}

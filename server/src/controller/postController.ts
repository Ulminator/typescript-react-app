import { Request, Response } from 'express';
import * as _ from 'lodash';
import pool from '../pg/pool';
import * as queries from '../pg/queries';
import generateInClause from '../util/generateInClause';
import formatJson from '../util/formatJson';

// http://localhost:8080/api/posts?include=id,title,image_id,created_at
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
        comments: `/api/posts/${row.id}/comments`,
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

export async function getPostById(req: Request, res: Response) {

  const { postId } = req.params;
  const { include, expand } = req.query;

  const { rows } = await pool.query(queries.getPostById, [postId]);

  if (rows.length === 0) {
    res.status(404).send({});
  } else {
    const body: any = {};
    const row = rows[0];

    const omittedArr = ['user_id'];
    const post = formatJson(row, include, omittedArr);

    body._expandable = {
      comments: `/api/users/${row.user_id}`,
    };

    if (expand !== undefined) {
      const entries = expand.split(',');
      for (const entry of entries) {
        if (entry === 'comments') {
          const comments: any = [];
          const commentIds = new Set();
          const { rows: cRows } = await pool.query(queries.getCommentsAndUsersByPostId, [postId]);
          cRows.forEach((row) => {
            const omitted = _.omit(row, ['user_id', 'username', 'u_created_at', 'c_created_at']);
            const comment = _.mapKeys(omitted, (value, key) => _.camelCase(key));
            comment.user = {
              id: row.user_id,
              username: row.username,
              createdAt: row.u_created_at,
              _links: {
                self: `/users/${row.user_id}`,
                comments: `/users/${row.user_id}/comments`,
                posts: `/users/${row.user_id}/posts`,
                replies: `/users/${row.user_id}/replies`,
              },
            };

            commentIds.add(row.id);

            comment._links = {
              self: `/comments/${row.id}`,
              post: `/posts/${postId}`,
              replies: `/comments/${row.id}/replies`, // remove after i inject
            };

            comments.push(comment);
          });

          let query = queries.getRepliesAndUsersByCommentIdsStart;
          const inClause = generateInClause([...commentIds]);
          query = query + inClause + queries.getRepliesAndUsersByCommentIdsEnd;
          const { rows: rRows } = await pool.query(query, [...commentIds]);

          // comments.forEach((comment: any) => {
          //   rRows.forEach((row) => {
          //     if (comment.id === row.comment_id) {
          //       comment.reply = row;
          //     } else {
          //       break;
          //     }

          //   });
          // });
          // console.log(comments);
          // const big: any[][] = [];
          // for (const comment of comments) {
          //   console.log(comment);
          //   const medium: any[] = [];
          //   for (const row of rRows) {
          //     if (comment.id === row.comment_id) {
          //       const small = comment;
          //       small.reply = row;
          //       medium.push(small);
          //     } else {
          //       break;
          //     }
          //   }
          //   big.push(medium);
          // }
          // post.comments = big;
        }
      }
    }

    body.post = post;
    res.status(200).send(body);
  }

  // if (rows)
  // const { rows: cRows } = await pool.query(queries.getCommentsAndRepliesByPostId, [postId]);

  // const user_ids = new Set();
  // let { comments }: { comments: Comment[] } = cRows[0];

  // if (comments !== null) {
  //   comments.forEach((comment) => {
  //     if (!user_ids.has(comment.user_id)) user_ids.add(comment.user_id);
  //     comment.replies.forEach((reply) => {
  //       if (!user_ids.has(reply.user_id)) user_ids.add(reply.user_id);
  //     });
  //   });

  //   const { rows: uRows }: { rows: Row[] } = await pool.query(queries.getUsernamesById +
  //     generateInClause([...user_ids]), [...user_ids]);
  //   const idUsernameMap: IHash = {};
  //   uRows.forEach(row => idUsernameMap[row.id] = row.username);

  //   comments.forEach((comment) => {
  //     comment.username = idUsernameMap[comment.user_id];
  //     comment.replies.forEach((reply) => {
  //       reply.username = idUsernameMap[reply.user_id];
  //     });
  //   });
  // } else {
  //   comments = [];
  // }
  // res.send({ id: pRows[0].id, userId: pRows[0].user_id,
  // title: pRows[0].title, imageId: pRows[0].image_id, createdAt: pRows[0].created_at, comments });
}

// export async function getPostById(req: Request, res: Response) {
//   const { postId } = req.params;

//   const { rows: pRows } = await pool.query(queries.getPostById, [postId]);
//   const { rows: cRows } = await pool.query(queries.getCommentsAndRepliesByPostId, [postId]);

//   const user_ids = new Set();
//   let { comments }: { comments: Comment[] } = cRows[0];

//   if (comments !== null) {
//     comments.forEach((comment) => {
//       if (!user_ids.has(comment.user_id)) user_ids.add(comment.user_id);
//       comment.replies.forEach((reply) => {
//         if (!user_ids.has(reply.user_id)) user_ids.add(reply.user_id);
//       });
//     });

//     const { rows: uRows }: { rows: Row[] } = await pool.query(queries.getUsernamesById +
//       generateInClause([...user_ids]), [...user_ids]);
//     const idUsernameMap: IHash = {};
//     uRows.forEach(row => idUsernameMap[row.id] = row.username);

//     comments.forEach((comment) => {
//       comment.username = idUsernameMap[comment.user_id];
//       comment.replies.forEach((reply) => {
//         reply.username = idUsernameMap[reply.user_id];
//       });
//     });
//   } else {
//     comments = [];
//   }

//   res.send({ id: pRows[0].id, userId: pRows[0].user_id,
// title: pRows[0].title, imageId: pRows[0].image_id, createdAt: pRows[0].created_at, comments });
// }

interface Row { id: string; username: string; }
interface IHash { [details: string]: string; }
interface Reply {
  reply_id: number;
  user_id: string;
  content: string;
  created_at: Date;
  username: string;
}
interface Comment {
  comment_id: number;
  user_id: string;
  content: string;
  created_at: Date;
  replies: Reply[];
  username: string;
}

// localhost:8080/api/posts/1/comment
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
            replies: `/api/comments/${id}/replies`,
            // user: `/api/users/${userId}`,
          };
          res.status(200).send(body);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({});
        });
}

import { Request, Response } from 'express';
import client from '../pg/pgConnect';

const selectAllPostTitles = 'SELECT id, title FROM website.posts;'

const selectPostById = 'SELECT id, title, image_id FROM website.posts WHERE id = $1;';
const selectCommentsByPostId = 'SELECT id, username, content, created_at FROM website.post_comments where post_id = $1 ORDER BY created_at ASC;';
const selectRepliesByCommentId = 'SELECT comment_id, username, content, created_at FROM website.post_comment_replies where comment_id IN';

const insertNewPost = 'INSERT INTO website.posts (user_id, title, image_id) VALUES ($1, $2, $3) RETURNING id;'
const insertNewComment = 'INSERT INTO website.post_comments (post_id, username, content) VALUES ($1, $2, $3);'

const insertNewReply = 'INSERT INTO website.post_comment_replies (comment_id, username, content) VALUES ($1, $2, $3);'

export async function getAllPostTitles(req: Request, res: Response) {
  const { rows } = await client.query(selectAllPostTitles);
  res.send(rows);
}

function generateInClause(arr: number[]) {
  let inClause = ' ( ';
  for (let i = 1; i <= arr.length; i++) {
    if (i == arr.length) {
      inClause += `$${i} `;
    } else {
      inClause += `$${i}, `;
    }
  }
  inClause += ')'
  return inClause;
}

export async function getPostById(req: Request, res: Response) {
  // validate postid -> make sure it is an integer
  const { postId } = req.params;
  
  const { rows: postRows } = await client.query(selectPostById, [postId]);
  const { rows: comments } = await client.query(selectCommentsByPostId, [postId]);
  //make sure comments is not null or this will break
  let comment_ids: number[] = [];
  // comment has any type rn
  comments.forEach(comment => comment_ids.push(comment.id));

  let inClause = generateInClause(comment_ids) + ' ORDER BY comment_id, created_at ASC;'
  console.log(selectRepliesByCommentId + inClause);
  const { rows: replies } = await client.query(selectRepliesByCommentId + inClause, comment_ids);

  comments.forEach(comment => {
    comment.replies = [];
    replies.forEach(reply => {
      if (comment.id === reply.comment_id) {
        comment.replies.push(reply);
      }
    });
  });

  const reply: GetPostByIdReply = {
    id: postRows[0].id,
    title: postRows[0].title,
    image_id: postRows[0].image_id,
    comments
  };

  res.send(reply);
}

interface Reply { comment_id: number, username: string, content: string, created_at: Date }
interface Comment { id: number, username: string, content: string, created_at: Date, replies: Reply[] }
interface GetPostByIdReply { id: number, title: string, image_id: number, comments: Comment[] }

// must create a row on website.posts and website.post_comments
export async function createNewPost(req: Request, res: Response) {
  // validate post body

  // generate unique id on frontend for image, upload it to gcs, send image_id along with post to this function
  const { body } = req;
  const { title, image_id, user_id, username, content } = body;

  try {
    const { rows } = await client.query(insertNewPost, [user_id, title, image_id]);
    const { id } = rows[0];

    client.query(insertNewComment, [id, username, content]).then(() => res.status(200).send());
  } catch (err) {
    console.log(err);
    res.status(500).send({});
  }
}

export async function createNewComment(req: Request, res: Response) {

  const { body } = req;
  const { post_id, username, content } = body;

  client.query(insertNewComment, [post_id, username, content])
        .then(() => res.status(200).send())
        .catch(err => {
          console.log(err);
          res.status(500).send({});
        });

}

export async function createNewReply(req: Request, res: Response) {

  const { body } = req;
  const { comment_id, username, content } = body;

  try {
    client.query(insertNewReply, [comment_id, username, content]).then(() => res.status(200).send());
  } catch (err) {
    console.log(err);
    res.status(500).send({});
  }
}

import * as helper from './helper';

export const postUsersPost = `INSERT INTO ${helper.POSTS} (user_id, title, image_id) VALUES ($1, $2, $3) RETURNING id, created_at;`

export const getPosts = `SELECT id, user_id, title, image_id, created_at FROM ${helper.POSTS};`

export const getPostById = `SELECT id, user_id, title, image_id, created_at FROM ${helper.POSTS} WHERE id = $1;`;
export const getCommentsAndRepliesByPostId = 'SELECT json_agg(json_build_object( '+
                                          "'comment_id', pc.id, " +
                                          "'content', pc.content, " +
                                          "'user_id', pc.user_id, " +
                                          "'created_at', pc.created_at, " +
                                          "'replies', ( " +
                                            "SELECT coalesce(json_agg(json_build_object( " +
                                              "	'reply_id', pcr.id, " +
                                              "	'user_id', pcr.user_id, " +
                                              "	'content', pcr.content, " +
                                              "	'created_at', pcr.created_at " +
                                              ") ORDER BY pcr.created_at), '[]') " +
                                              `FROM ${helper.POST_COMMENT_REPLIES} pcr ` +
                                              "WHERE pc.id = pcr.comment_id AND pc.post_id = $1 " +
                                          ") " +
                                        ") ORDER BY pc.created_at) AS comments " +
                                        `FROM ${helper.POST_COMMENTS} pc WHERE pc.post_id = $1;`;
export const getUsernamesById = `SELECT id, username FROM ${helper.USERS} WHERE id IN `;

export const getPostsCommentById = `SELECT id, post_id, user_id, content, created_at FROM ${helper.POST_COMMENTS} WHERE id = $1`;

export const postPostsComment = `INSERT INTO ${helper.POST_COMMENTS} (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, created_at;`

export const getPostsCommentsReplyById = `SELECT id, comment_id, user_id, content, created_at FROM ${helper.POST_COMMENT_REPLIES} WHERE id = $1`;

export const postsPostsCommentsReply = `INSERT INTO ${helper.POST_COMMENT_REPLIES} (comment_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, created_at;`

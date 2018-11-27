import * as helper from './helper';

// User Controller
export const postUsersPost = `INSERT INTO ${helper.POSTS} (user_id, title, image_id) ` +
                             'VALUES ($1, $2, $3) RETURNING id, created_at;';

export const postPostsComment = `INSERT INTO ${helper.COMMENTS} (post_id, user_id, content) ` +
                                'VALUES ($1, $2, $3) RETURNING id, created_at;';

// New Post Controller
// have a join and get username??
export const getCommentsAndUsersByPostId = 'SELECT ' +
                                   'c.id, c.user_id, c.content, c.created_at c_created_at, ' +
                                   'u.username, u.email, u.created_at u_created_at ' +
                                   `FROM ${helper.COMMENTS} c, ${helper.USERS} u ` +
                                   'WHERE post_id = $1 AND c.user_id = u.id ' +
                                   'ORDER BY c.created_at ASC;';

export const getRepliesAndUsersByCommentIdsStart = 'SELECT ' +
                                      'r.id, r.comment_id, r.user_id, r.content, r.created_at, ' +
                                      'u.username, u.email, u.created_at u_created_at ' +
                                      `FROM ${helper.REPLIES} r, ` +
                                      `${helper.COMMENTS} c, ${helper.USERS} u ` +
                                      'WHERE c.id IN ';
export const getRepliesAndUsersByCommentIdsEnd = 'AND r.comment_id=c.id AND r.user_id=u.id ' +
                                             'ORDER BY r.comment_id, r.created_at ASC';

// Post Controller
export const getPosts = `SELECT id, user_id, title, image_id, created_at FROM ${helper.POSTS};`;

export const getPostById = 'SELECT id, user_id, title, image_id, created_at ' +
                           `FROM ${helper.POSTS} WHERE id = $1;`;
export const getCommentsAndRepliesByPostId = 'SELECT json_agg(json_build_object( ' +
                                          "'comment_id', pc.id, " +
                                          "'content', pc.content, " +
                                          "'user_id', pc.user_id, " +
                                          "'created_at', pc.created_at, " +
                                          "'replies', ( " +
                                            'SELECT coalesce(json_agg(json_build_object( ' +
                                              "	'reply_id', pcr.id, " +
                                              "	'user_id', pcr.user_id, " +
                                              "	'content', pcr.content, " +
                                              "	'created_at', pcr.created_at " +
                                              ") ORDER BY pcr.created_at), '[]') " +
                                              `FROM ${helper.REPLIES} pcr ` +
                                              'WHERE pc.id = pcr.comment_id AND pc.post_id = $1 ' +
                                          ') ' +
                                        ') ORDER BY pc.created_at) AS comments ' +
                                        `FROM ${helper.COMMENTS} pc WHERE pc.post_id = $1;`;
export const getUsernamesById = `SELECT id, username FROM ${helper.USERS} WHERE id IN `;

// Comment Controller
export const getCommentById = 'SELECT id, post_id, user_id, content, created_at ' +
                                   `FROM ${helper.COMMENTS} WHERE id = $1;`;

export const getUserById = 'SELECT id, username, email, created_at ' +
                           `FROM ${helper.USERS} ` +
                           'WHERE id = $1;';

export const getRepliesByCommentId = 'SELECT id, comment_id, user_id, content, created_at ' +
                                     `FROM ${helper.REPLIES} ` +
                                     'WHERE comment_id = $1 ORDER BY created_at ASC;';

// Reply Controller
export const postCommentsReply = `INSERT INTO ${helper.REPLIES} ` +
                                       '(comment_id, user_id, content) ' +
                                       'VALUES ($1, $2, $3) RETURNING id, created_at;';

export const getReplyById = 'SELECT id, comment_id, user_id, content, created_at ' +
                            `FROM ${helper.REPLIES} WHERE id = $1`;

import * as tables from './tables';

// User Controller
export const postUsersPost = `INSERT INTO ${tables.POSTS} (user_id, title, image_id) ` +
                             'VALUES ($1, $2, $3) RETURNING id, created_at;';

export const postPostsComment = `INSERT INTO ${tables.COMMENTS} (post_id, user_id, content) ` +
                                'VALUES ($1, $2, $3) RETURNING id, created_at;';

// Post Controller
export const getPosts = 'SELECT id, user_id, title, image_id, created_at ' +
                        `FROM ${tables.POSTS} ` +
                        'ORDER BY created_at ASC;';

export const getPostByPostId = 'SELECT p.id, p.title, p.image_id, ' +
                                  'p.created_at, p.user_id, u.username ' +
                                  `FROM ${tables.POSTS} p ` +
                                  'INNER JOIN website.USERS u ' +
                                  'ON p.user_id = u.id ' +
                                  'WHERE p.id = $1 ';

export const getCommentsByPostId = 'SELECT ' +
                                       'c.id, c.user_id, c.content, c.created_at, u.username ' +
                                       `FROM ${tables.COMMENTS} c, ${tables.USERS} u ` +
                                       'WHERE post_id = $1 AND c.user_id = u.id ' +
                                       'ORDER BY c.created_at ASC;';

export const getRepliesByCommentIds = 'SELECT r.id, r.comment_id, r.content, ' +
                                      'r.created_at, r.user_id, u.username ' +
                                   `FROM ${tables.REPLIES} r, ${tables.COMMENTS} c, ` +
                                   `${tables.USERS} u ` +
                                   'WHERE r.user_id = u.id ' +
                                   'AND r.comment_id = c.id ' +
                                   'AND r.comment_id IN ';
export const orderByCommentIdAndCreatedAt = 'ORDER BY r.comment_id, r.created_at ASC';

// Comment Controller
export const getCommentById = 'SELECT id, post_id, user_id, content, created_at ' +
                                   `FROM ${tables.COMMENTS} WHERE id = $1;`;

export const getUserById = 'SELECT id, username, email, created_at ' +
                           `FROM ${tables.USERS} ` +
                           'WHERE id = $1;';

export const getRepliesByCommentId = 'SELECT id, comment_id, user_id, content, created_at ' +
                                     `FROM ${tables.REPLIES} ` +
                                     'WHERE comment_id = $1 ORDER BY created_at ASC;';

// Reply Controller
export const postCommentsReply = `INSERT INTO ${tables.REPLIES} ` +
                                       '(comment_id, user_id, content) ' +
                                       'VALUES ($1, $2, $3) RETURNING id, created_at;';

export const getReplyById = 'SELECT id, comment_id, user_id, content, created_at ' +
                            `FROM ${tables.REPLIES} WHERE id = $1`;

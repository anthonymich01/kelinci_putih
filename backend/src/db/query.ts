// USER Query
export const getAllUser: string = `
SELECT id, email, full_name, avatar_url, created_at, deleted_at
FROM users WHERE deleted_at IS NULL
ORDER by full_name
`

export const getUserByEmail: string = `
SELECT id, password FROM users WHERE email = $1 AND deleted_at IS NULL
`

export const getUserDetailById: string = `
SELECT id, email, full_name, avatar_url, created_at, deleted_at FROM users WHERE id = $1 AND deleted_at IS NULL
`

export const insertNewUserByEmailPassword: string = `
INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3)
`

// Conversation Query
export const getConversationBetweenUser: string = `
SELECT id, from_id, to_id, message, to_char(created_at, 'Dy, HH12.MI am') as created_at
FROM conversations
WHERE (from_id = $1 OR from_id = $2) AND (to_id = $1 OR to_id = $2) AND deleted_at IS NULL
ORDER BY id DESC
LIMIT 40
`

export const addConversationMessage: string = `
INSERT INTO conversations (from_id, to_id, message)
VALUES ($1, $2, $3)
`

// Post Query
export const getPostsFromUser: string = `
SELECT id, from_id, to_id, post, to_char(created_at, 'Dy, HH12.MI am') as created_at
FROM posts
WHERE to_id = $1 AND deleted_at IS NULL
ORDER BY id DESC
LIMIT 25
`

export const addPostMessage: string = `
INSERT INTO posts (from_id, to_id, post)
VALUES ($1, $2, $3)
`

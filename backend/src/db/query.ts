// USER Query
export const getAllUser: string = `
SELECT id, email, full_name, avatar_url, is_online, created_at, deleted_at
FROM users WHERE deleted_at IS NULL
ORDER by full_name
`

export const getUserByEmail: string = `
SELECT id, password FROM users WHERE email = $1 AND deleted_at IS NULL
`

export const getUserDetailById: string = `
SELECT id, email, full_name, avatar_url, is_online, created_at, deleted_at FROM users WHERE id = $1 AND deleted_at IS NULL
`

export const insertNewUserByEmailPassword: string = `
INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3)
`

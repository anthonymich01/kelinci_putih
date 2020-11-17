import db from "../db"
import { getPostsFromUser, addPostMessage } from "../db/query"

export const getPosts = async (id: number): Promise<any[]> => {
  try {
    const res = await db.query(getPostsFromUser, [id])
    return res.rows
  } catch (error) {
    console.log(error)
    return []
  }
}

export const addPost = async (from: number, to: number, post: string): Promise<{}> => {
  try {
    await db.query(addPostMessage, [from, to, post])
    return "Success"
  } catch (error) {
    console.log(error)
    return "Error"
  }
}

export default {
  getPosts,
  addPost
}

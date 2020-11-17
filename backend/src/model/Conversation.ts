import db from "../db"
import { getConversationBetweenUser, addConversationMessage } from "../db/query"

export const getConversations = async (from: number, to: number): Promise<any[]> => {
  try {
    const res = await db.query(getConversationBetweenUser, [from, to])
    return res.rows
  } catch (error) {
    console.log(error)
    return []
  }
}

export const addConversation = async (from: number, to: number, msg: string): Promise<string> => {
  try {
    await db.query(addConversationMessage, [from, to, msg])
    return "Success"
  } catch (error) {
    console.log(error)
    return "Error"
  }
}

export default {
  getConversations,
  addConversation
}

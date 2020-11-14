import bcrypt from "bcrypt"
import { saltRounds } from "../constant/bcrypt"
import db from "../db"
import jwt from "jsonwebtoken"
import { jwtExpires, jwtData } from "../constant/jwt"
import { insertNewUserByEmailPassword, getUserByEmail } from "../db/query"

type userAuth = {
  access_token: string
  message: string
}

const isEmailDuplicated = async (email: string): Promise<boolean> => {
  try {
    const res = await db.query(getUserByEmail, [email])
    if (res.rows[0]) {
      return true
    }
    return false
  } catch (error) {
    console.log(error)
    return false
  }
}

export const loginUserByEmailPassword = async (email: string, password: string): Promise<userAuth> => {
  try {
    const res = await db.query(getUserByEmail, [email])
    if (res.rows[0]) {
      const userData: any = res.rows[0]
      const checkPassword: boolean = await bcrypt.compare(password, userData.password)
      if (checkPassword) {
        const jwtSecret: string = process.env.JWT_SECRET!
        const data: jwtData = {
          id: userData.id,
          email: userData.email
        }
        const access_token: string = jwt.sign(data, jwtSecret, { expiresIn: jwtExpires })
        return { access_token, message: "Successfully Logged in!" }
      }
    }
    return { access_token: "", message: "Email / Password anda salah." }
  } catch (error) {
    console.log(error)
    return { access_token: "", message: error }
  }
}

export const createUserByEmailPassword = async (full_name: string, email: string, password: string): Promise<userAuth> => {
  const checkUserEmail: boolean = await isEmailDuplicated(email)
  if (checkUserEmail) return { access_token: "", message: "Email already taken." }

  const trimmedFullName: string = full_name.trim()
  const trimmedEmail: string = email.trim()
  const hashedPassword: string = await bcrypt.hash(password, saltRounds)

  try {
    await db.query(insertNewUserByEmailPassword, [trimmedFullName, trimmedEmail, hashedPassword])
    const loginAttempRes = await loginUserByEmailPassword(trimmedEmail, password)
    return { access_token: loginAttempRes.access_token, message: "" }
  } catch (error) {
    console.log(error)
    return { access_token: "", message: error }
  }
}

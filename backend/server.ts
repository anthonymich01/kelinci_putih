require("dotenv").config()
import express from "express"
import { graphqlHTTP } from "express-graphql"
import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import jwt from "jsonwebtoken"
import cors from "cors"
import morgan from "morgan"
import UserModel from "./src/model/User"
import ConversationModel from "./src/model/Conversation"
import PostModel from "./src/model/Post"

// Import Query Type
import AuthType from "./src/graphql/type/auth"
import UserType from "./src/graphql/type/user"
import ConversationType from "./src/graphql/type/conversation"
import PostType from "./src/graphql/type/post"

// The root provides a resolver function for each API endpoint
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    login: {
      type: AuthType,
      description: "Login With Email & Password",
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, { email, password }) => {
        return await UserModel.loginUserByEmailPassword(email, password)
      }
    },
    users: {
      type: new GraphQLList(UserType),
      description: "List of All Users",
      resolve: async () => {
        return await UserModel.getAllUserList()
      }
    },
    user: {
      type: UserType,
      description: "A Single User",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: async (parent, args, req) => {
        if (!req.userId) {
          throw new Error("Access Denied")
        }
        return await UserModel.getUserDetail(args.id || req.userId)
      }
    },
    conversations: {
      type: new GraphQLList(ConversationType),
      description: "Conversations Between Users",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: async (parent, args, req) => {
        if (!req.userId) {
          throw new Error("Access Denied")
        }
        return await ConversationModel.getConversations(req.userId, args.id)
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      description: "User Posts List",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: async (parent, args, req) => {
        if (!req.userId) {
          throw new Error("Access Denied")
        }
        return await PostModel.getPosts(args.id)
      }
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    register: {
      type: AuthType,
      description: "Register New User & Login",
      args: {
        full_name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, { full_name, email, password }) => {
        return await UserModel.createUserByEmailPassword(full_name, email, password)
      }
    },
    addConversation: {
      type: GraphQLString,
      description: "Add Conversation",
      args: {
        to_id: { type: GraphQLNonNull(GraphQLInt) },
        message: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args, req) => {
        if (!req.userId) {
          throw new Error("Access Denied")
        }
        return await ConversationModel.addConversation(req.userId, args.to_id, args.message)
      }
    },
    addPost: {
      type: GraphQLString,
      description: "Add Post",
      args: {
        to_id: { type: GraphQLNonNull(GraphQLInt) },
        post: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args, req) => {
        if (!req.userId) {
          throw new Error("Access Denied")
        }
        return await PostModel.addPost(req.userId, args.to_id, args.post)
      }
    }
  })
})

// Construct a schema, using GraphQL schema language
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

const app = express()
const PORT = process.env.EXP_PORT || 3000

// Middleware
const authTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = (authHeader && authHeader.split(" ")[1]) || ""
  if (token) {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    if (decoded) {
      req.userId = decoded.id
    }
  }
  next()
}

app.use(cors())
app.use(morgan("tiny"))
app.use(authTokenMiddleware)
app.use(
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    pretty: true
  })
)

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
})

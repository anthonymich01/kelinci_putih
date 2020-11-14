require("dotenv").config()
import express from "express"
import { graphqlHTTP } from "express-graphql"
import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import cors from "cors"
import morgan from "morgan"
import { createUserByEmailPassword, loginUserByEmailPassword } from "./src/model/User"

// Import Query Type
import AuthType from "./src/graphql/type/auth"

const UserType = new GraphQLObjectType({
  name: "User",
  description: "A Single User",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    full_name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLNonNull(GraphQLString) },
    deleted_at: { type: GraphQLNonNull(GraphQLString) }
  })
})

// The root provides a resolver function for each API endpoint
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      description: "List of All Users",
      resolve: () => ["aa"]
    },
    user: {
      type: UserType,
      description: "A Single Book",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args, req) => {
        return { id: 2, name: req.token }
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
        const res = await createUserByEmailPassword(full_name, email, password)
        console.log(res)
        return res
      }
    },
    login: {
      type: AuthType,
      description: "Login",
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, { email, password }) => {
        const res = await loginUserByEmailPassword(email, password)
        console.log(res)
        return res
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

const authTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = (authHeader && authHeader.split(" ")[1]) || ""
  req.token = token
  next()
}

// Middleware
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

import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from "graphql"

export default new GraphQLObjectType({
  name: "Auth",
  description: "Attempt to auth",
  fields: () => ({
    access_token: { type: GraphQLNonNull(GraphQLString) },
    message: { type: GraphQLNonNull(GraphQLString) }
  })
})

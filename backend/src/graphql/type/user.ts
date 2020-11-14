import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } from "graphql"

export default new GraphQLObjectType({
  name: "User",
  description: "A Single User",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    email: { type: GraphQLNonNull(GraphQLString) },
    full_name: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLNonNull(GraphQLString) },
    deleted_at: { type: GraphQLString }
  })
})

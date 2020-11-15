import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLBoolean } from "graphql"

export default new GraphQLObjectType({
  name: "User",
  description: "A Single User",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    email: { type: GraphQLNonNull(GraphQLString) },
    full_name: { type: GraphQLNonNull(GraphQLString) },
    avatar_url: { type: GraphQLString },
    is_online: { type: GraphQLNonNull(GraphQLBoolean) },
    created_at: { type: GraphQLNonNull(GraphQLString) },
    deleted_at: { type: GraphQLString }
  })
})

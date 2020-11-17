import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql"

export default new GraphQLObjectType({
  name: "Post",
  description: "A Single Post.",
  fields: () => ({
    from_id: { type: GraphQLNonNull(GraphQLInt) },
    to_id: { type: GraphQLNonNull(GraphQLInt) },
    post: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLNonNull(GraphQLString) }
  })
})

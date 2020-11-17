import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql"

export default new GraphQLObjectType({
  name: "Conversation",
  description: "A Single Conversation Message",
  fields: () => ({
    from_id: { type: GraphQLNonNull(GraphQLInt) },
    to_id: { type: GraphQLNonNull(GraphQLInt) },
    message: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLNonNull(GraphQLString) }
  })
})

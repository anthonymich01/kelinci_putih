import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLInt } from "graphql"
import UserModel from "../../model/User"
import UserType from "./user"

export default new GraphQLObjectType({
  name: "Post",
  description: "A Single Post.",
  fields: () => ({
    from_id: { type: GraphQLNonNull(GraphQLInt) },
    to_id: { type: GraphQLNonNull(GraphQLInt) },
    post: { type: GraphQLNonNull(GraphQLString) },
    created_at: { type: GraphQLNonNull(GraphQLString) },
    created_by: {
      type: UserType,
      resolve: async (user) => {
        return await UserModel.getUserDetail(user.from_id)
      }
    }
  })
})

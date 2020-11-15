import { ApolloClient, InMemoryCache } from "@apollo/client"

const client = (token) => {
  const headers = token
    ? {
        authorization: `bearer ${token}`
      }
    : {}

  return new ApolloClient({
    uri: "http://localhost:3010/",
    cache: new InMemoryCache(),
    headers
  })
}

const getUserDetail = (id, token) => {}

export default client

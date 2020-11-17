import { ApolloClient, InMemoryCache } from "@apollo/client"
import { gql } from "@apollo/client"
import Cookie from "js-cookie"

const access_token = Cookie.get("access_token")

const client = (token = null) => {
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

export const loginAttempt = async (email, password) => {
  return await client(null).query({
    query: gql`
      query {
        login(email: "${email}", password: "${password}") {
          access_token
        }
      }
    `
  })
}

export const getLoggedInUser = async (token) => {
  return await client(token).query({
    query: gql`
      query {
        users {
          id
          full_name
          email
          avatar_url
        }
        user {
          id
          full_name
          email
          avatar_url
        }
      }
    `
  })
}

export const getUserDetailById = async (token, id) => {
  const myToken = token || access_token
  return await client(myToken).query({
    query: gql`
      query { 
        user(id:${id}) {
          id
          full_name
          email
          avatar_url
        }
      }
    `
  })
}

export const getConversationsBetweenUsers = async (id) => {
  return await client(access_token).query({
    query: gql`
      query {
        conversations(id: ${id}) {
          from_id
          to_id
          message
          created_at
        }
      }
      
    `
  })
}

export const addConversation = async (id, msg) => {
  return await client(access_token).mutate({
    mutation: gql`
      mutation {
        addConversation(to_id: ${id}, message: "${msg}")
      }
      
    `
  })
}

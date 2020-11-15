import React from "react"
import socketIOClient from "socket.io-client"
import nextCookie from "next-cookies"
import Router from "next/router"
import { gql } from "@apollo/client"
import API from "../src/api"
import { Card, Label, Image, Button } from "semantic-ui-react"
import Layout from "../src/component/Layout"
import style from "../src/style/home.module.scss"

const SOCKET_SERVER_URL = "http://localhost:4000"

class Home extends React.Component {
  static async getInitialProps(ctx) {
    const { access_token = null } = nextCookie(ctx)
    const res = await API(access_token).query({
      query: gql`
        query {
          users {
            id
            full_name
            email
            avatar_url
            is_online
          }
        }
      `
    })

    const usersList = res.data.users
    const sortedUsers = usersList.slice().sort((a, b) => b.is_online - a.is_online)
    return { users: sortedUsers }
  }

  componentDidMount() {
    const socket = socketIOClient(SOCKET_SERVER_URL)
    socket.on("connect", function () {})
  }

  render() {
    const { users } = this.props

    return (
      <>
        <Layout>
          <h1>Members</h1>
          <div>
            <Card.Group itemsPerRow={4}>
              {users.map((user, key) => {
                return (
                  <Card raised color={user.is_online ? "green" : "grey"} key={key}>
                    <Card.Content style={{ cursor: "pointer" }} onClick={() => Router.push(`/profile/${user.id}`)}>
                      <Image
                        style={{ marginBottom: 0 }}
                        floated="left"
                        size="mini"
                        src={user.avatar_url || "/avatar-default.png"}
                      />
                      <Card.Header>{user.full_name}</Card.Header>
                      <Card.Meta>
                        {user.is_online ? "Online" : "Offline"}
                        {user.is_online && <Label style={{ marginLeft: "5px" }} size="mini" circular color="green" empty />}
                      </Card.Meta>
                    </Card.Content>
                    <Card.Content extra>
                      <Button icon="edit" color="blue" content="Post" />
                      <Button floated="right" icon="chat" color="blue" />
                    </Card.Content>
                  </Card>
                )
              })}
            </Card.Group>
          </div>
        </Layout>
      </>
    )
  }
}

export default Home

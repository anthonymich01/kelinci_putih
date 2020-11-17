import React from "react"
import nextCookie from "next-cookies"
import Cookie from "js-cookie"
import Router from "next/router"
import _ from "lodash"
import { getLoggedInUser } from "../src/api"
import io from "socket.io-client"
import { ONLINE_USERS_EVENT, userConnected, SOCKET_SERVER_URL } from "../src/utils/socket"
import { sortedUsersList } from "../src/utils"
import Layout from "../src/component/Layout"
import LoginOrRegister from "../src/component/LoginOrRegister"
import { Card, Label, Image, Button } from "semantic-ui-react"
import style from "../src/style/home.module.scss"

class Home extends React.Component {
  static async getInitialProps(ctx) {
    const { access_token = null } = nextCookie(ctx)

    if (access_token) {
      const res = await getLoggedInUser(access_token)
      const usersList = res.data.users
      const me = res.data.user
      return { users: usersList, me }
    }

    return { users: {}, me: {} }
  }

  state = { onlineUsers: [] }
  socket = io(SOCKET_SERVER_URL)

  componentDidMount = async () => {
    const token = Cookie.get("access_token") || ""
    const { me } = this.props
    if (token) {
      userConnected(this.socket, me.id)

      this.socket.on(ONLINE_USERS_EVENT, (data) => {
        this.setState({ onlineUsers: data.online_users })
      })
    }
  }

  componentWillUnmount = () => {
    this.socket.disconnect()
  }

  render() {
    const { users, me } = this.props

    if (_.isEmpty(me)) {
      return (
        <div id={style.root}>
          <LoginOrRegister />
        </div>
      )
    }

    const { onlineUsers } = this.state
    const sortedUsers = sortedUsersList(users, onlineUsers)

    return (
      <>
        <Layout user={me} users={sortedUsers} socket={this.socket}>
          <h1>Members</h1>
          <div>
            <Card.Group>
              {sortedUsers.map((user, key) => {
                return (
                  <Card raised color={user.isOnline ? "green" : "grey"} key={key}>
                    <Card.Content style={{ cursor: "pointer" }} onClick={() => Router.push(`/profile/${user.id}`)}>
                      <Image
                        style={{ marginBottom: 0 }}
                        floated="left"
                        size="mini"
                        src={user.avatar_url || "/avatar-default.png"}
                      />
                      <Card.Header>{user.full_name}</Card.Header>
                      <Card.Meta>
                        {user.isOnline ? "Online" : "Offline"}
                        {user.isOnline && <Label style={{ marginLeft: "5px" }} size="mini" circular color="green" empty />}
                      </Card.Meta>
                    </Card.Content>
                    <Card.Content extra>
                      <Button
                        icon="edit"
                        color="blue"
                        content="Post"
                        onClick={() => Router.push(`/profile/${user.id}`)}
                        floated="right"
                      />
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

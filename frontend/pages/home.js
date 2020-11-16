import React from "react"
import socketIOClient from "socket.io-client"
import nextCookie from "next-cookies"
import Cookie from "js-cookie"
import Router from "next/router"
import _ from "lodash"
import { getLoggedInUser } from "../src/api"
import { NEW_USER_LOGIN_EVENT, ONLINE_USERS_EVENT, USER_LEAVE_EVENT } from "../src/constant"
import { Card, Label, Image, Button } from "semantic-ui-react"
import Layout from "../src/component/Layout"
import LoginOrRegister from "../src/component/LoginOrRegister"
import style from "../src/style/home.module.scss"

const SOCKET_SERVER_URL = "http://localhost:4000"

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

  socket = socketIOClient(SOCKET_SERVER_URL)

  componentDidMount = () => {
    const token = Cookie.get("access_token") || ""
    const { me } = this.props
    if (token) {
      this.socket.emit(NEW_USER_LOGIN_EVENT, { userId: me.id, token: this.socket.id })
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
    const joinUsers = users.map((user) => {
      const isOnline = !!onlineUsers.find((ou) => ou.id === user.id)
      return { ...user, isOnline: isOnline }
    })
    const sortedUsers = joinUsers.slice().sort((a, b) => b.isOnline - a.isOnline)
    console.log(sortedUsers)

    return (
      <>
        <Layout user={me}>
          <h1>Members</h1>
          <div>
            <Card.Group itemsPerRow={4}>
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
                      <Button icon="edit" color="blue" content="Post" />
                      {me.id != user.id && <Button floated="right" icon="chat" color="blue" />}
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

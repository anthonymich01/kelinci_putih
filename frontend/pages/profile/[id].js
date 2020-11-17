import React from "react"
import nextCookie from "next-cookies"
import Cookie from "js-cookie"
import { getUserDetailById, getLoggedInUser } from "../../src/api"
import io from "socket.io-client"
import { ONLINE_USERS_EVENT, userConnected, SOCKET_SERVER_URL } from "../../src/utils/socket"
import { Item, Icon, Button, Segment, Feed, Divider, Form } from "semantic-ui-react"
import Layout from "../../src/component/Layout"
import style from "../../src/style/profile.module.scss"
import { sortedUsersList } from "../../src/utils"

export default class Profile extends React.Component {
  static async getInitialProps(ctx) {
    const { id = null } = ctx.query
    const { access_token = null } = nextCookie(ctx)

    try {
      const resProfile = await getUserDetailById(access_token, id)
      const resLoggedIn = await getLoggedInUser(access_token)
      return { user: resProfile.data.user, id, me: resLoggedIn.data.user, users: resLoggedIn.data.users }
    } catch (error) {
      console.log(error)
      return {}
    }
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
        console.log(data.online_users)
      })
    }
  }

  componentWillUnmount = () => {
    this.socket.disconnect()
  }

  render() {
    const { user, id, me, users } = this.props
    const { onlineUsers } = this.state
    const firstName = user.full_name.split(" ")[0]
    const notMe = id && me.id != id
    const sortedUsers = sortedUsersList(users, onlineUsers)

    return (
      <Layout user={me} users={sortedUsers}>
        <h1>{firstName}'s Profile</h1>

        <Item.Group>
          <Item>
            <Item.Image rounded size="small" src={user.avatar_url || "/avatar-default.png"} />
            <Item.Content verticalAlign="middle">
              <Item.Header id={style.profileName}>{user.full_name}</Item.Header>
              <Item.Meta id={style.profileEmail}>
                <Icon name="mail outline" id={style.profileEmailIcon} />
                {user.email}
              </Item.Meta>
              {notMe && (
                <Item.Description id={style.profileDesc}>
                  <Button icon="chat" content="Message" color="blue" />
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>

        <h3>{firstName}'s Feed</h3>
        <Segment raised id={style.profileNewPost}>
          <h3>{notMe ? `Leave a post for ${firstName}` : "What's in your mind?"}</h3>
          <Form>
            <Form.TextArea rows={3} placeholder={`${notMe ? `@${firstName} ` : ""}AMD Ryzen > any Intel CPU !`} autoFocus />
            <Button content="Post!" labelPosition="left" icon="edit" color="blue" floated="right" />
            <div style={{ clear: "both" }} />
          </Form>
        </Segment>
        <Segment raised stacked color="blue" id={style.profileFeed}>
          <Feed>
            <Feed.Event>
              <Feed.Label image="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>Elliot Fu</Feed.User>
                  <Feed.Date>1 Hour Ago</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text style={{ maxWidth: "100%" }}>
                  Ours is a life of constant reruns. We're always circling back to where we'd we started, then starting all over
                  again. Even if we don't run extra laps that day, we surely will come back for more of the same another day soon.
                </Feed.Extra>
              </Feed.Content>
            </Feed.Event>
            <Divider />
            <Feed.Event>
              <Feed.Label image="https://react.semantic-ui.com/images/avatar/small/elliot.jpg" />
              <Feed.Content>
                <Feed.Summary>
                  <Feed.User>Elliot Fu</Feed.User>
                  <Feed.Date>1 Hour Ago</Feed.Date>
                </Feed.Summary>
                <Feed.Extra text style={{ maxWidth: "100%" }}>
                  Ours is a life of constant reruns. We're always circling back to where we'd we started, then starting all over
                  again. Even if we don't run extra laps that day, we surely will come back for more of the same another day soon.
                </Feed.Extra>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        </Segment>
      </Layout>
    )
  }
}

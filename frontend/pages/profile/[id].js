import React from "react"
import nextCookie from "next-cookies"
import Cookie from "js-cookie"
import { getUserDetailById, getLoggedInUser, addPost, getPostsFromUser } from "../../src/api"
import io from "socket.io-client"
import { sortedUsersList } from "../../src/utils"
import Router from "next/router"
import { ONLINE_USERS_EVENT, userConnected, SOCKET_SERVER_URL } from "../../src/utils/socket"
import { Item, Icon, Button, Segment, Feed, Form, Header } from "semantic-ui-react"
import Layout from "../../src/component/Layout"
import style from "../../src/style/profile.module.scss"

export default class Profile extends React.Component {
  static async getInitialProps(ctx) {
    const { id = null } = ctx.query
    const { access_token = null } = nextCookie(ctx)

    try {
      const resProfile = await getUserDetailById(access_token, id)
      const resLoggedIn = await getLoggedInUser(access_token)
      const resPostList = await getPostsFromUser(access_token, id)
      return {
        user: resProfile.data.user,
        me: resLoggedIn.data.user,
        users: resLoggedIn.data.users,
        postList: resPostList.data.posts
      }
    } catch (error) {
      console.log(error)
      return {}
    }
  }

  state = { onlineUsers: [], postList: [], postMsg: "" }

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
    this.setState({ onlineUsers: [], postList: [], postMsg: "" })
  }

  handleSubmitPost = async () => {
    const { user } = this.props
    const { postMsg } = this.state
    const trimmedPost = postMsg.trim()

    if (trimmedPost.length >= 1) {
      try {
        await addPost(user.id, trimmedPost)
        Router.push(`/profile/${user.id}`)
        this.setState({ postMsg: "" })
      } catch (error) {
        console.log(error)
      }
    }
  }

  render() {
    const { user, id, me, users, postList } = this.props
    const { onlineUsers, postMsg } = this.state
    const firstName = user.full_name.split(" ")[0]
    const isMe = id && me.id == id
    const sortedUsers = sortedUsersList(users, onlineUsers)

    return (
      <Layout user={me} users={sortedUsers} socket={this.socket}>
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
            </Item.Content>
          </Item>
        </Item.Group>

        <h2>{firstName}'s Feed</h2>
        <Segment raised id={style.profileNewPost}>
          <h3>{!isMe ? `Leave a post for ${firstName}` : "What's in your mind?"}</h3>
          <Form onSubmit={this.handleSubmitPost}>
            <Form.TextArea
              rows={3}
              placeholder={`${!isMe ? `@${firstName} ` : ""}AMD Ryzen > any Intel CPU !`}
              value={postMsg}
              onChange={(e) => this.setState({ postMsg: e.target.value })}
              autoFocus
            />
            <Button type="submit" content="Post!" labelPosition="left" icon="edit" color="blue" floated="right" />
            <div style={{ clear: "both" }} />
          </Form>
        </Segment>
        <Segment raised stacked color="blue" id={style.profileFeed} placeholder={postList.length < 1}>
          {postList.length < 1 ? (
            <Header icon>
              <Icon name="comments outline" />
              {`${isMe ? "You" : firstName} never post before.`}
            </Header>
          ) : (
            <Feed>
              {postList.map((p, k) => {
                return (
                  <Feed.Event key={k} className={style.feedItem}>
                    <Feed.Label image={p.created_by.avatar_url || "/avatar-default.png"} />
                    <Feed.Content>
                      <Feed.Date>{p.created_at}</Feed.Date>
                      <Feed.Summary>
                        <Feed.User onClick={() => Router.push(`/profile/${p.created_by.id}`)}>{p.created_by.full_name}</Feed.User>
                      </Feed.Summary>
                      <Feed.Extra text style={{ maxWidth: "100%" }}>
                        {p.post}
                      </Feed.Extra>
                    </Feed.Content>
                  </Feed.Event>
                )
              })}
            </Feed>
          )}
        </Segment>
      </Layout>
    )
  }
}

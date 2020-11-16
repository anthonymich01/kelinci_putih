import React from "react"
import nextCookie from "next-cookies"
import { getUserDetailById, getLoggedInUser } from "../../src/api"
import { Label, Item, Icon, Button, Segment, Feed, Divider } from "semantic-ui-react"
import Layout from "../../src/component/Layout"
import style from "../../src/style/profile.module.scss"

export default class Profile extends React.Component {
  static async getInitialProps(ctx) {
    const { id = null } = ctx.query
    const { access_token = null } = nextCookie(ctx)

    try {
      const resProfile = await getUserDetailById(access_token, id)
      const resLoggedIn = await getLoggedInUser(access_token)
      return { user: resProfile.data.user, id, me: resLoggedIn.data.user }
    } catch (error) {
      console.log(error)
      return {}
    }
  }

  render() {
    const { user, id, me } = this.props
    const firstName = user.full_name.split(" ")[0]
    console.log(id, me.id)

    return (
      <Layout user={me}>
        <h1>
          {firstName}'s Profile
          {user.is_online && <Label style={{ marginLeft: "10px" }} size="mini" circular color="green" empty />}
        </h1>

        <Item.Group>
          <Item>
            <Item.Image rounded size="small" src={user.avatar_url || "/avatar-default.png"} />
            <Item.Content verticalAlign="middle">
              <Item.Header id={style.profileName}>{user.full_name}</Item.Header>
              <Item.Meta id={style.profileEmail}>
                <Icon name="mail outline" id={style.profileEmailIcon} />
                {user.email}
              </Item.Meta>
              {id && me.id != id && (
                <Item.Description id={style.profileDesc}>
                  <Button icon="chat" content="Message" color="blue" />
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>

        <h3>{firstName}'s Feed</h3>
        <Segment raised id={style.profileNewPost}>
          ffff
        </Segment>
        <Segment raised id={style.profileFeed}>
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

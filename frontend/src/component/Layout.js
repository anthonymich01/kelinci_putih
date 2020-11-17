import React from "react"
import Link from "next/link"
import Router from "next/router"
import { List, Image, Label } from "semantic-ui-react"
import style from "./Layout.module.scss"
import { logout } from "../utils/auth"

class Layout extends React.Component {
  state = { chatOpen: false }

  handleChatOpen = () => this.setState({ chatOpen: !this.state.chatOpen })

  render() {
    const { children, user, users } = this.props
    const { chatOpen } = this.state
    const filteredUsers = users.slice()
    const idx = filteredUsers.findIndex((u) => u.id === user.id)
    filteredUsers.splice(idx, 1)
    const onlineUsers = filteredUsers.filter((u) => u.isOnline === true).length

    return (
      <>
        <div className={style.leftMenu}>
          <Link href="/">
            <a>
              <h1 className={style.logo}>Kelinci-Putih</h1>
            </a>
          </Link>

          <div className={style.you}>
            <Image circular id={style.avatar} src={user.avatar_url || "/avatar-default.png"} />
            <h4>{user.full_name}</h4>
            <p>{user.email}</p>
          </div>

          <List size="big" verticalAlign="middle" relaxed>
            <List.Item className={style.listMenu} onClick={() => Router.push("/")}>
              <List.Content floated="right">
                <List.Icon name="home" fitted />
              </List.Content>
              <List.Content>Home</List.Content>
            </List.Item>
            <List.Item className={style.listMenu} onClick={() => Router.push("/profile")}>
              <List.Content floated="right">
                <List.Icon name="user" fitted />
              </List.Content>
              <List.Content>Profile</List.Content>
            </List.Item>
            <List.Item className={style.listMenu} onClick={() => logout()}>
              <List.Content floated="right">
                <List.Icon name="sign out" fitted />
              </List.Content>
              <List.Content>Logout</List.Content>
            </List.Item>
          </List>
        </div>
        <div className={style.rightMenu}>
          {children}
          {!chatOpen && (
            <div className={style.chatTrigger} onClick={() => this.handleChatOpen()}>
              Chat ({onlineUsers})
            </div>
          )}
          {chatOpen && (
            <div className={style.chatList}>
              <h4 className={style.chatTitle} onClick={() => this.handleChatOpen()}>
                Chat ({onlineUsers})
              </h4>
              <List style={{ margin: "5px 0" }} selection animated verticalAlign="middle" relaxed="very">
                {filteredUsers.map((u, k) => {
                  console.log(u.full_name)
                  return (
                    <List.Item key={k}>
                      <Image avatar src={u.avatar_url || "/avatar-default.png"} />
                      <List.Content>
                        <List.Header>
                          {u.full_name}
                          {u.isOnline && <Label style={{ marginLeft: "5px" }} size="mini" circular color="green" empty />}
                        </List.Header>
                      </List.Content>
                    </List.Item>
                  )
                })}
              </List>
            </div>
          )}
        </div>
      </>
    )
  }
}

export default Layout

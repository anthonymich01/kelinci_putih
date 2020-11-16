import React from "react"
import Link from "next/link"
import Router from "next/router"
import { Icon, List, Image } from "semantic-ui-react"
import style from "./Layout.module.scss"
import { logout } from "../utils/auth"

class Layout extends React.Component {
  render() {
    const { children, user } = this.props
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
            <List.Item onClick={() => Router.push("/")}>
              <List.Icon name="home" />
              <List.Content>Home</List.Content>
            </List.Item>
            <List.Item onClick={() => Router.push("/profile")}>
              <Icon name="user" />
              <List.Content>Profile</List.Content>
            </List.Item>
            <List.Item onClick={() => logout()}>
              <Icon name="sign out" />
              <List.Content>Logout</List.Content>
            </List.Item>
          </List>
        </div>
        <div className={style.rightMenu}>{children}</div>
      </>
    )
  }
}

export default Layout

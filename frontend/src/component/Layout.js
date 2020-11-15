import React from "react"
import Link from "next/link"
import Router from "next/router"
import { Icon, List, Image } from "semantic-ui-react"
import style from "./Layout.module.scss"

class Layout extends React.Component {
  render() {
    const { children } = this.props
    return (
      <>
        <div className={style.leftMenu}>
          <Link href="/">
            <a>
              <h1 className={style.logo}>Kelinci-Putih</h1>
            </a>
          </Link>

          <div className={style.you}>
            <Image circular id={style.avatar} src="/avatar-default.png" />
            <h4>Anthony Michael</h4>
            <p>anthony9a2@gmail.com</p>
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
            <List.Item>
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

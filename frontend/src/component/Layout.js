import React from "react"
import Link from "next/link"
import Router from "next/router"
import { addConversation, getConversationsBetweenUsers, getUserDetailById } from "../api"
import { GET_CHAT_MESSAGE_EVENT, NEW_CHAT_MESSAGE_EVENT } from "../utils/socket"
import { logout } from "../utils/auth"
import ChatBox from "./ChatBox"
import { List, Image, Label } from "semantic-ui-react"
import style from "./Layout.module.scss"

class Layout extends React.Component {
  state = { chatListOpen: false, chatBoxOpen: false, conversations: [], toUser: {} }

  chatBoxContentRef = React.createRef()

  handleChatListOpen = () => this.setState({ chatListOpen: !this.state.chatListOpen })

  handleChatBoxOpen = async (id) => {
    try {
      this.updateConversation(id)
    } catch (error) {
      console.log(error)
    }
  }

  handleSendMessage = async (inputMsg) => {
    const { socket, user } = this.props
    const { toUser } = this.state
    const input = inputMsg.trim()
    if (input.length >= 1) {
      try {
        await addConversation(toUser.id, input)
        socket.emit(NEW_CHAT_MESSAGE_EVENT, {
          from_id: user.id,
          to_id: toUser.id,
          message: input
        })
        this.updateConversation(toUser.id)
      } catch (error) {
        console.log(error)
      }
    }
  }

  componentDidMount = () => {
    const soundNotif = new Audio("/stairs-567.ogg")
    this.props.socket.on(GET_CHAT_MESSAGE_EVENT, async (data) => {
      this.updateConversation(data.from_id)
      try {
        soundNotif.play()
      } catch (error) {
        console.log(error)
      }
    })
  }

  updateConversation = async (id) => {
    const resToUser = await getUserDetailById(null, id)
    const resConversations = await getConversationsBetweenUsers(id)
    this.setState({
      chatBoxOpen: true,
      conversations: resConversations.data.conversations,
      toUser: resToUser.data.user
    })
    this.chatBoxContentRef.current.scrollTo({ top: this.chatBoxContentRef.current.scrollHeight })
  }

  render() {
    const { children, user, users } = this.props
    const { chatListOpen, chatBoxOpen, toUser, conversations } = this.state
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
            <List.Item className={style.listMenu} onClick={() => this.handleChatListOpen()}>
              <List.Content floated="right">
                <List.Icon name="chat" fitted />
              </List.Content>
              <List.Content>Messaging</List.Content>
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
          {!chatListOpen && (
            <div className={style.chatTrigger} onClick={() => this.handleChatListOpen()}>
              Chat ({onlineUsers})
            </div>
          )}
          {chatListOpen && (
            <div className={style.chatList}>
              <h4 className={style.chatTitle} onClick={() => this.handleChatListOpen()}>
                Chat ({onlineUsers})
              </h4>
              <List style={{ margin: "5px 0" }} selection animated verticalAlign="middle" relaxed="very">
                {filteredUsers.map((u, k) => {
                  return (
                    <List.Item key={k} onClick={() => this.handleChatBoxOpen(u.id)}>
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

          {chatBoxOpen && (
            <ChatBox
              user={user}
              toUser={toUser}
              conversations={conversations}
              handleSendMessage={this.handleSendMessage}
              closeChatBox={() => this.setState({ chatBoxOpen: false })}
              chatBoxContentRef={this.chatBoxContentRef}
            />
          )}
        </div>
      </>
    )
  }
}

export default Layout

import React from "react"
import Link from "next/link"
import { Icon, Input, List, Popup, Image } from "semantic-ui-react"
import style from "./ChatBox.module.scss"

const chatTimePopupStyle = {
  padding: "5px 10px",
  opacity: 0.8
}

export default class ChatBox extends React.Component {
  state = { inputMsg: "" }

  sendMessage = () => {
    const { handleSendMessage, chatBoxContentRef } = this.props
    const { inputMsg } = this.state

    handleSendMessage(inputMsg)
    this.setState({ inputMsg: "" })
    chatBoxContentRef.current.scrollTo({ top: chatBoxContentRef.current.scrollHeight, behavior: "smooth" })
  }

  componentDidMount() {
    const { chatBoxContentRef } = this.props
    chatBoxContentRef.current.scrollTo({ top: chatBoxContentRef.current.scrollHeight })
  }

  render() {
    const { user, toUser, conversations, closeChatBox, chatBoxContentRef } = this.props
    const { inputMsg } = this.state

    return (
      <div className={style.chatBox}>
        <p className={style.chatBoxTitle}>
          <Link href={`/profile/${toUser.id}`}>
            <a>{toUser.full_name}</a>
          </Link>
          <span className={style.chatBoxClose}>
            <Icon name="close" fitted onClick={closeChatBox} />
          </span>
        </p>

        <div className={style.chatBoxContent} ref={chatBoxContentRef}>
          <List verticalAlign="middle">
            {conversations
              .slice()
              .reverse()
              .map((c, k) => {
                if (user.id === c.from_id) {
                  return (
                    <List.Item key={k}>
                      <Popup
                        content={c.created_at}
                        position="left center"
                        mouseEnterDelay={300}
                        on="hover"
                        style={chatTimePopupStyle}
                        inverted
                        trigger={
                          <List.Content floated="right" className={`${style.receiveBubble} ${style.sendBubble}`}>
                            {c.message}
                          </List.Content>
                        }
                      />
                    </List.Item>
                  )
                }

                return (
                  <List.Item key={k}>
                    <Popup
                      position="left center"
                      content={toUser.full_name}
                      mouseEnterDelay={300}
                      on="hover"
                      inverted
                      trigger={
                        <Image
                          avatar
                          className={style.chatBoxAva}
                          src={toUser.avatar_url}
                          onClick={() => Router.push(`/profile/${toUser.id}`)}
                        />
                      }
                    />
                    <Popup
                      content={c.created_at}
                      position="right center"
                      mouseEnterDelay={300}
                      on="hover"
                      style={chatTimePopupStyle}
                      inverted
                      trigger={<List.Content className={style.receiveBubble}>{c.message}</List.Content>}
                    />
                  </List.Item>
                )
              })}
          </List>
        </div>

        <div className={style.inputBox}>
          <Input
            type="text"
            icon={<Icon name="send" color="blue" link onClick={this.sendMessage} />}
            onKeyDown={(e) => e.key === "Enter" && this.sendMessage()}
            onChange={(e) => this.setState({ inputMsg: e.target.value })}
            value={inputMsg}
            fluid
            autoFocus
          />
        </div>
      </div>
    )
  }
}

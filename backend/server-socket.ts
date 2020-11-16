require("dotenv").config()
const server = require("http").createServer()
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

const PORT = process.env.SOC_PORT || 4000
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"
const NEW_USER_LOGIN_EVENT = "newUserLogin"
const USER_LEAVE_EVENT = "UserLeave"
const ONLINE_USERS_EVENT = "onlineUsers"

const onlineUsers: onlineUser[] = []

type onlineUser = {
  id: string
  token: string
}

io.on("connection", (socket) => {
  // Listen for online users
  socket.on(NEW_USER_LOGIN_EVENT, (data) => {
    const newUser: onlineUser = {
      id: data.userId,
      token: socket.id
    }
    onlineUsers.push(newUser)
    console.log(onlineUsers)

    function sendOnlineUsers() {
      socket.emit(ONLINE_USERS_EVENT, { online_users: onlineUsers })
      setTimeout(sendOnlineUsers, 5000)
    }
    // Send online users every 5 sec
    sendOnlineUsers()

    socket.on("disconnect", () => {
      const idx = onlineUsers.findIndex((user) => user.token === socket.id)
      onlineUsers.splice(idx, 1)
      console.log(onlineUsers)
    })
  })
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

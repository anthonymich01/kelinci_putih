require("dotenv").config()
const server = require("http").createServer()
const options = {
  cors: {
    origin: ["http://localhost:3000", "https://anthonyyy.my.id", "https://www.anthonyyy.my.id"]
  }
}
const io = require("socket.io")(server, options)

const PORT: string = process.env.SOC_PORT || "4000"
const NEW_CHAT_MESSAGE_EVENT: string = "newChatMessage"
const GET_CHAT_MESSAGE_EVENT: string = "getChatMessage"
const NEW_USER_LOGIN_EVENT: string = "newUserLogin"
const USER_LEAVE_EVENT: string = "UserLeave"
const ONLINE_USERS_EVENT: string = "onlineUsers"

type onlineUser = {
  id: string
  token: string
}

const onlineUsers: onlineUser[] = []

io.on("connection", (socket) => {
  // Listen for new user login
  socket.on(NEW_USER_LOGIN_EVENT, (data) => {
    const newUser: onlineUser = {
      id: data.userId,
      token: socket.id
    }

    onlineUsers.push(newUser)

    socket.emit(ONLINE_USERS_EVENT, { online_users: onlineUsers })
    socket.broadcast.emit(ONLINE_USERS_EVENT, { online_users: onlineUsers })

    socket.on(NEW_CHAT_MESSAGE_EVENT, ({ from_id, to_id, message }) => {
      const socketId = onlineUsers.find((u) => u.id === to_id)
      if (socketId) {
        io.to(socketId.token).emit(GET_CHAT_MESSAGE_EVENT, { from_id, message })
      }
    })

    socket.on("disconnect", () => {
      const idx = onlineUsers.findIndex((user) => user.token === socket.id)
      setTimeout(() => {
        onlineUsers.splice(idx, 1)
        socket.broadcast.emit(ONLINE_USERS_EVENT, { online_users: onlineUsers })
      }, 100)
    })
  })
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

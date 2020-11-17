require("dotenv").config()
const server = require("http").createServer()
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

const PORT = process.env.SOC_PORT || 4000
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"
const GET_CHAT_MESSAGE_EVENT = "getChatMessage"
const NEW_USER_LOGIN_EVENT = "newUserLogin"
const USER_LEAVE_EVENT = "UserLeave"
const ONLINE_USERS_EVENT = "onlineUsers"

const onlineUsers: onlineUser[] = []

type onlineUser = {
  id: string
  token: string
}

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
      }, 1000)
    })
  })
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

require("dotenv").config()
const server = require("http").createServer()
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000"
  }
})

const PORT = process.env.SOC_PORT || 4000
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"

io.on("connection", (socket) => {
  // Join a conversation
  console.log("aaaaaaaa")

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    console.log("c")
  })

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log("bbbbbbbbbb")
  })
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

export const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET

// Socket.io Event
export const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"
export const GET_CHAT_MESSAGE_EVENT = "getChatMessage"
export const NEW_USER_LOGIN_EVENT = "newUserLogin"
export const USER_LEAVE_EVENT = "UserLeave"
export const ONLINE_USERS_EVENT = "onlineUsers"

export const userConnected = (socket, userId) => {
  socket.emit(NEW_USER_LOGIN_EVENT, { userId, token: socket.id })
}

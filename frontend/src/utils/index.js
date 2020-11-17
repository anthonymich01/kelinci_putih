export const sortedUsersList = (users, onlineUsers) => {
  const joinUsers = users.map((user) => {
    const isOnline = !!onlineUsers.find((ou) => ou.id === user.id)
    return { ...user, isOnline: isOnline }
  })

  return joinUsers.slice().sort((a, b) => b.isOnline - a.isOnline)
}

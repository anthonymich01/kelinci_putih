import Cookie from "js-cookie"

export const login = (token) => {
  Cookie.set("access_token", token, { expires: 30 })
  window.location = "/"
}

export const logout = () => {
  Cookie.remove("access_token")
  window.location = "/"
}

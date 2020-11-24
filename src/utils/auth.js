const TokenKey = 'Admin-Token'
const Userinfo = 'userinfo'
export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getUserinfo() {
  return JSON.parse(localStorage.getItem(Userinfo) || '{}')
}

export function setUserinfo(userinfo) {
  return localStorage.setItem(Userinfo, JSON.stringify(userinfo))
}

export function removeUserinfo() {
  return localStorage.removeItem(Userinfo)
}

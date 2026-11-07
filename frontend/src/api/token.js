const TOKEN_KEY = import.meta.env.VITE_LOCAL_STORAGE_ITEM_NAME || 'TIENDA_TECH_ACCESS_TOKEN'

export function getToken() {
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

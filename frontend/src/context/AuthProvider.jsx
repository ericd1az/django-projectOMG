import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMeApi } from '../api/user'
import { getToken, removeToken, setToken } from '../api/token'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getToken() ? undefined : null)

  useEffect(() => {
    const savedToken = getToken()
    if (!savedToken) return

    let active = true
    getMeApi(savedToken)
      .then((me) => {
        if (active) setAuth({ token: savedToken, me })
      })
      .catch(() => {
        if (active) {
          removeToken()
          setAuth(null)
        }
      })
    return () => { active = false }
  }, [])

  const login = useCallback(async (token) => {
    const me = await getMeApi(token)
    setToken(token)
    setAuth({ token, me })
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setAuth(null)
  }, [])

  const value = useMemo(() => ({ auth, login, logout }), [auth, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

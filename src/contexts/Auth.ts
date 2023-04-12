import { createContext } from 'react'

interface AuthContext {
  user: Record<string, any>
}

export const Auth = createContext<AuthContext>({
  user: {},
})

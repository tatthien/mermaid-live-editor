import { Auth } from '@/contexts/Auth'
import { supabase } from '@/lib/supabase'
import Cookie from 'js-cookie'
import { useState, useEffect } from 'react'

interface AuthProviderProps {
  children: JSX.Element
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState({})

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_OUT':
          setUser({})
          break
        default: {
          if (session && session.user) {
            setUser(session.user)
          }
        }
      }
    })
  }, [])

  const contextValue = {
    user,
  }

  return <Auth.Provider value={contextValue}>{children}</Auth.Provider>
}

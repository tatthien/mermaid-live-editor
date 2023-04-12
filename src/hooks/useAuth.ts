import { Auth } from '@/contexts/Auth'
import { useContext } from 'react'

export const useAuth = () => useContext(Auth)

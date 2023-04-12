import { GlobalUI } from '@/contexts/GlobalUI'
import { useContext } from 'react'

export const useGlobalUI = () => useContext(GlobalUI)

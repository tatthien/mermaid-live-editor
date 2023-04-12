import { GlobalUI } from '@/contexts/GlobalUI'
import { useState } from 'react'

interface GlobalUIProviderProps {
  children: JSX.Element
}

export default function GlobalUIProvider({ children }: GlobalUIProviderProps) {
  const [showSidebar, setShowSidebar] = useState(true)
  const contextValue = {
    showSidebar,
    setShowSidebar: (value: boolean) => setShowSidebar(value),
  }

  return <GlobalUI.Provider value={contextValue}>{children}</GlobalUI.Provider>
}

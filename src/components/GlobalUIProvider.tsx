import { GlobalUI, GlobalUiContext } from '@/contexts/GlobalUI'
import { useState } from 'react'

interface GlobalUIProviderProps {
  children: JSX.Element
}

export default function GlobalUIProvider({ children }: GlobalUIProviderProps) {
  const [showSidebar, setShowSidebar] = useState(true)
  const [showDiagramList, setShowDiagramList] = useState(false)
  const contextValue: GlobalUiContext = {
    showSidebar,
    setShowSidebar: (value: boolean) => setShowSidebar(value),
    showDiagramList,
    toggleDiagramList: () => setShowDiagramList(!showDiagramList),
  }

  return <GlobalUI.Provider value={contextValue}>{children}</GlobalUI.Provider>
}

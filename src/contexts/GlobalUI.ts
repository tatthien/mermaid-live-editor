import { createContext } from 'react'

export interface GlobalUiContext {
  showSidebar: boolean
  setShowSidebar: (value: boolean) => void
  showDiagramList: boolean
  toggleDiagramList: () => void
}

export const GlobalUI = createContext<GlobalUiContext>({
  showSidebar: false,
  showDiagramList: false,
  setShowSidebar: (v) => v, // @TODO: this snippet is made to satisfy the type (value: boolen) => void
  toggleDiagramList: () => false, // @TODO: this snippet is made to satisfy the type (value: boolen) => void
})

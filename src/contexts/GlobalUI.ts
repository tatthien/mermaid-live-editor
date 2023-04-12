import { createContext } from 'react'

interface GlobalUiContext {
  showSidebar: boolean
  setShowSidebar: (value: boolean) => void
}

export const GlobalUI = createContext<GlobalUiContext>({
  showSidebar: false,
  setShowSidebar: (v) => v, // @TODO: this snippet is made to satisfy the type (value: boolen) => void
})

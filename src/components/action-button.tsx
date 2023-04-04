import type { ReactNode, MouseEventHandler } from 'react'

export const ActionButton = (props: {
  icon: ReactNode
  text: string
  displayText?: boolean
  onClick: MouseEventHandler
}) => {
  const displayText = props.displayText ?? false
  return (
    <button
      className={`${
        displayText ? 'px-1.5 py-1' : 'p-0.5'
      } inline-flex cursor-pointer items-center justify-center gap-1 rounded border border-slate-200 bg-white text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring focus:ring-slate-300 focus:ring-offset-1`}
      onClick={props.onClick}
      aria-label={`${props.text} button`}>
      {props.icon} {displayText && props.text}
    </button>
  )
}

export default ActionButton

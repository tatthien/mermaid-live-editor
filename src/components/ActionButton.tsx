import type { ReactNode, MouseEventHandler } from 'react'

import LoaderIcon from './icons/LoaderIcon'

export const ActionButton = (props: {
  icon: ReactNode
  text: string
  displayText?: boolean
  variant?: string
  disabled?: boolean
  loading?: boolean
  onClick: MouseEventHandler
}) => {
  const displayText = props.displayText ?? false
  const disabled = props.disabled || props.loading
  const variant = props.variant ?? 'primary'

  const commonClasses =
    'inline-flex items-center justify-center gap-1.5 rounded border text-sm font-medium shadow-sm transition focus:outline-none focus:ring focus:ring-offset-1'
  const variantClasses =
    variant === 'primary'
      ? 'bg-pink-500 text-white border-pink-600 hover:bg-pink-400 focus:ring-pink-400'
      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 focus:ring-slate-300'
  const disabledClasses = disabled ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer'
  const spacingClasses = displayText ? 'px-1.5 py-1' : 'p-0.5'

  return (
    <button
      className={`${spacingClasses} ${variantClasses} ${disabledClasses} ${commonClasses}`}
      onClick={props.onClick}
      aria-label={`${props.text} button`}
      disabled={disabled}>
      {props.loading ? (
        <span className='animate-spin'>
          <LoaderIcon />
        </span>
      ) : (
        props.icon
      )}
      {displayText && props.text}
    </button>
  )
}

export default ActionButton

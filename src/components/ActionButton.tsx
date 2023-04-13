import { IconLoader } from '@tabler/icons-react'
import cx from 'clsx'
import type { ReactNode, MouseEventHandler } from 'react'

export const ActionButton = (props: {
  icon: ReactNode
  text: string
  displayText?: boolean
  variant?: string
  disabled?: boolean
  loading?: boolean
  onClick: MouseEventHandler
  className?: string
}) => {
  const displayText = props.displayText ?? false
  const disabled = props.disabled || props.loading
  const variant = props.variant ?? 'primary'

  const commonClasses =
    'inline-flex items-center justify-center gap-1.5 rounded border text-sm font-medium shadow-sm transition focus:outline-none focus:ring'
  const variantClasses =
    variant === 'primary'
      ? 'bg-slate-900 text-white hover:bg-slate-700 focus:ring-slate-400'
      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 focus:ring-slate-300'
  const disabledClasses = disabled ? 'opacity-40 cursor-not-allowed' : 'opacity-100 cursor-pointer'
  const spacingClasses = displayText ? 'px-1.5 py-1' : 'p-0.5'

  return (
    <button
      className={cx(spacingClasses, variantClasses, disabledClasses, commonClasses, props.className)}
      onClick={props.onClick}
      aria-label={`${props.text} button`}
      disabled={disabled}>
      {props.loading ? (
        <span className='animate-spin'>
          <IconLoader size={20} />
        </span>
      ) : (
        props.icon
      )}
      {displayText && props.text}
    </button>
  )
}

export default ActionButton

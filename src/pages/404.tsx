import cx from 'clsx'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-slate-50'>
      <div className='mb-4 text-center text-xl font-medium'>
        <img src='/logo.svg' alt='Logo' className='mx-auto mb-2 w-10' />
        <Link href='/'>usediagram.com</Link>
      </div>
      <div className='w-[350px] max-w-[350px] rounded-md border bg-white p-4 shadow-md'>
        <div className='mb-4'>
          The resource you are looking for has been removed, had its name changed, or is temporarily
          unavailable.
        </div>
        <Link
          href='/'
          className={cx(
            'cursor-pointer bg-slate-900 text-white hover:bg-slate-700',
            'inline-flex w-full items-center justify-center gap-1.5 rounded border px-2 py-1 font-medium shadow-sm transition focus:outline-none focus:ring focus:ring-slate-300'
          )}>
          Go back home
        </Link>
      </div>
    </div>
  )
}

import { supabase } from '@/lib/supabase'
import { IconLoader } from '@tabler/icons-react'
import cx from 'clsx'
import Link from 'next/link'
import { ChangeEvent, useState } from 'react'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [successfulMsg, setSuccessfulMsg] = useState('')

  async function onSubmit(event: any) {
    event.preventDefault()
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
    })
    setIsLoading(false)
    if (error) {
      setError('🚫 Opps! Is the email corrects?')
      setTimeout(() => setError(''), 2000)
      return
    }
    setSuccessfulMsg('✅ Check your email for the magic link')
    setTimeout(() => setSuccessfulMsg(''), 5000)
  }
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-slate-50'>
      <div className='mb-4 text-xl font-medium'>
        <Link href='/'>usediagram.com</Link>
      </div>
      <div className='w-[350px] max-w-[350px] rounded-md border bg-white p-4 shadow-md'>
        {error && (
          <div className='mb-4 rounded-md border border-red-300 bg-red-100 p-2 text-red-600'>{error}</div>
        )}
        {successfulMsg && (
          <div className='mb-4 rounded-md border border-green-300 bg-green-100 p-2 text-green-600'>
            {successfulMsg}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className='mb-4'>
            <label className='mb-1.5 block text-sm font-medium'>Email</label>
            <input
              type='email'
              required
              className='w-full rounded border border-slate-300 px-2 py-1 outline-none focus:border-slate-400 focus:ring focus:ring-slate-300'
              placeholder='you@example.com'
              value={email}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            />
          </div>
          <div className='mb-4 text-sm text-slate-500'>
            {`Simply enter your email address and we'll send you a magic link that you can use to access your account.`}
          </div>
          <div>
            <button
              className={cx(
                isLoading
                  ? 'cursor-not-allowed bg-slate-200 text-slate-900 hover:bg-slate-200'
                  : 'cursor-pointer bg-slate-900 text-white hover:bg-slate-700',
                'inline-flex w-full items-center justify-center gap-1.5 rounded border px-2 py-1 font-medium shadow-sm transition focus:outline-none focus:ring focus:ring-slate-300'
              )}
              disabled={isLoading}>
              <>
                {isLoading && (
                  <span className='animate-spin'>
                    <IconLoader size={20} />
                  </span>
                )}
                Get started
              </>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

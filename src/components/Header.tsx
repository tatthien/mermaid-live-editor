import ActionButton from '@/components/ActionButton'
import LayoutFullIcon from '@/components/icons/LayoutFullIcon'
import { useAuth } from '@/hooks/useAuth'
import { useGlobalUI } from '@/hooks/useGlobalUI'
import { supabase } from '@/lib/supabase'
import { IconShare, IconLink, IconCheck, IconLayoutSidebar } from '@tabler/icons-react'
import cx from 'clsx'
import isEqual from 'lodash/isEqual'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface IHeaderProps {
  shareId: string
  onShared: (id: string) => void
  content: string
}

export default function Header({ shareId, content, onShared }: IHeaderProps) {
  const router = useRouter()
  const [originalContent, setOriginalContent] = useState(content)
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [disableShareButton, setDisableShareButton] = useState(true)
  const { showSidebar, setShowSidebar } = useGlobalUI()
  const { user } = useAuth()

  useEffect(() => {
    setDisableShareButton(isEqual(content, originalContent))
  }, [content, originalContent])

  async function btnShareHandler() {
    try {
      setSharing(true)
      const res = await fetch(`/api/share`, {
        method: 'POST',
        body: JSON.stringify({
          content: content,
        }),
      })
      const { id } = await res.json()
      router.push(`/${id}`)
      setOriginalContent(content)
      onShared(id)
    } catch (err) {
      console.error(err)
    }
    setSharing(false)
  }

  async function btnCopyShareUrlHandler() {
    try {
      const { asPath } = router
      navigator.clipboard.writeText(process.env.NEXT_PUBLIC_BASE_URL + asPath)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 500)
    } catch (err) {
      console.error(err)
    }
  }

  async function logoutHandler() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log(error)
    }
  }

  return (
    <div className='sticky top-0 z-10 w-full border-b bg-white px-4 py-1.5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1 className='font-medium'>usediagram.com</h1>
          <ActionButton
            onClick={btnShareHandler}
            icon={<IconShare size={20} />}
            displayText
            text='Share'
            loading={sharing}
            disabled={disableShareButton}
          />
          {shareId !== '' && (
            <div
              onClick={btnCopyShareUrlHandler}
              className='ml-2 flex cursor-pointer items-center gap-1 text-sm text-slate-500 hover:text-slate-900'>
              <span className='truncate'>.../{shareId}</span>
              {copied ? <IconCheck size={20} /> : <IconLink size={20} />}
            </div>
          )}
        </div>
        <div className='flex items-center gap-3'>
          <div className='border-state-600 flex items-center gap-1 rounded-md border px-1 py-1 shadow-sm'>
            <button
              className={cx(
                showSidebar ? 'text-slate-900 hover:text-slate-900' : 'text-slate-400 hover:text-slate-600',
                'transition'
              )}
              onClick={() => setShowSidebar(true)}>
              <IconLayoutSidebar size={20} />
            </button>
            <button
              className={cx(
                !showSidebar ? 'text-slate-900 hover:text-slate-900' : 'text-slate-400 hover:text-slate-600',
                'transition'
              )}
              onClick={() => setShowSidebar(false)}>
              <LayoutFullIcon />
            </button>
          </div>
          {user.email ? (
            <>
              <span className='text-sm'>{user.email}</span>
              <Link
                href='#'
                onClick={logoutHandler}
                className='text-sm text-slate-500 hover:text-slate-900 hover:underline'>
                Logout
              </Link>
            </>
          ) : (
            <Link href='/login' className='text-sm text-slate-500 hover:text-slate-900 hover:underline'>
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

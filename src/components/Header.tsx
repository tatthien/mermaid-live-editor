import ActionButton from '@/components/ActionButton'
import CheckIcon from '@/components/icons/CheckIcon'
import LayoutFullIcon from '@/components/icons/LayoutFullIcon'
import LayoutSidebarIcon from '@/components/icons/LayoutSidebarIcon'
import LinkIcon from '@/components/icons/LinkIcon'
import ShareIcon from '@/components/icons/ShareIcon'
import cx from 'clsx'
import isEqual from 'lodash/isEqual'
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

  return (
    <div className='sticky top-0 z-10 w-full border-b bg-white px-4 py-1.5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1 className='font-medium'>usediagram.com</h1>
          <ActionButton
            onClick={btnShareHandler}
            icon={<ShareIcon />}
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
              {copied ? <CheckIcon /> : <LinkIcon />}
            </div>
          )}
        </div>
        <div>
          <div className='border-state-600 flex items-center gap-1 rounded-md border px-1 py-1 shadow-sm'>
            <button className={cx('text-slate-400 transition hover:text-slate-600')}>
              <LayoutSidebarIcon />
            </button>
            <button className={cx('text-slate-400 transition hover:text-slate-600')}>
              <LayoutFullIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

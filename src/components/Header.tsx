import ActionButton from '@/components/ActionButton'
import LayoutFullIcon from '@/components/icons/LayoutFullIcon'
import { useAuth } from '@/hooks/useAuth'
import { useGlobalUI } from '@/hooks/useGlobalUI'
import { supabase } from '@/lib/supabase'
import { setDiagramItem } from '@/stores/diagrams'
import { IconShare, IconLink, IconCheck, IconLayoutSidebar, IconMenu2 } from '@tabler/icons-react'
import cx from 'clsx'
import { debounce } from 'lodash'
import isEqual from 'lodash/isEqual'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface HeaderProps {
  shareId?: string
  content: string
  showBtnDiagramList?: boolean
}

export default function Header({ shareId: shareIdProp, content, showBtnDiagramList }: HeaderProps) {
  showBtnDiagramList = showBtnDiagramList ?? true
  const router = useRouter()
  const [shareId, setShareId] = useState(shareIdProp)
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [diagramTitle, setDiagramTitle] = useState('')
  const { showSidebar, setShowSidebar, toggleDiagramList } = useGlobalUI()
  const { user } = useAuth()
  const diagramItem = useSelector((state: any) => state.diagrams.item)

  useEffect(() => {
    if (diagramItem) {
      setDiagramTitle(diagramItem.title)
      setShareId(diagramItem.shares.length ? diagramItem.shares[0].share_id : '')
    }
  }, [diagramItem])

  async function btnShareHandler() {
    try {
      setSharing(true)
      const res = await fetch(`/api/share`, {
        method: 'POST',
        body: JSON.stringify({
          content: content,
          id: diagramItem.id,
          user_id: user.id,
        }),
      })
      const { id } = await res.json()
      setShareId(id)
    } catch (err) {
      console.error(err)
    }
    setSharing(false)
  }

  async function btnCopyShareUrlHandler() {
    try {
      navigator.clipboard.writeText(process.env.NEXT_PUBLIC_BASE_URL + `/s/${shareId}`)
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

  async function onChangeDiagramTitle(event: any) {
    setDiagramTitle(event.target.value)
  }

  async function onKeyPressDiagramTitle(event: any) {
    if (event.charCode === 13) {
      await supabase
        .from('diagrams')
        .update({ title: diagramTitle })
        .eq('id', diagramItem.id)
        .select()
        .single()
      event.target.blur()
    }
  }

  return (
    <div className='sticky top-0 z-10 w-full border-b bg-white px-4 py-1.5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          {showBtnDiagramList && (
            <span title={user.id ? 'Show diagrams' : 'Log in to save your diagrams'}>
              <ActionButton
                icon={<IconMenu2 size={20} />}
                text='Show diagram list'
                variant='secondary'
                onClick={toggleDiagramList}
                disabled={!user.id}
              />
            </span>
          )}
          <div className='flex items-center'>
            <h1 className='mr-2 font-medium'>
              <Link href='/'>usediagram.com</Link>
            </h1>
            {diagramItem && (
              <>
                <span className='mr-1'>/</span>
                <input
                  type='text'
                  value={diagramTitle}
                  onChange={onChangeDiagramTitle}
                  onKeyPress={onKeyPressDiagramTitle}
                  className='rounded border border-transparent px-1 text-slate-600 outline-none focus:border-slate-400 focus:ring focus:ring-slate-300'
                />
              </>
            )}
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='mr-6 flex items-center gap-2'>
            {!shareId && (
              <ActionButton
                onClick={btnShareHandler}
                icon={<IconShare size={20} />}
                displayText
                text='Share'
                loading={sharing}
              />
            )}
            {shareId && (
              <div
                onClick={btnCopyShareUrlHandler}
                className='ml-2 flex cursor-pointer items-center gap-1 text-sm text-slate-500 hover:text-slate-900'>
                <span className='truncate'>.../{shareId}</span>
                {copied ? <IconCheck size={20} /> : <IconLink size={20} />}
              </div>
            )}
          </div>
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

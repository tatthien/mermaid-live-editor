import ActionButton from '@/components/ActionButton'
import LayoutFullIcon from '@/components/icons/LayoutFullIcon'
import { useAuth } from '@/hooks/useAuth'
import { useGlobalUI } from '@/hooks/useGlobalUI'
import { supabase } from '@/lib/supabase'
import { editDiagram } from '@/stores/diagrams'
import { IconShare, IconLink, IconCheck, IconLayoutSidebar } from '@tabler/icons-react'
import cx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface HeaderProps {
  shareId?: string
  content: string
  showBtnDiagramList?: boolean
}

export default function Header({ shareId: shareIdProp, content, showBtnDiagramList }: HeaderProps) {
  showBtnDiagramList = showBtnDiagramList ?? true
  const [shareId, setShareId] = useState(shareIdProp)
  const [sharing, setSharing] = useState(false)
  const [showShareBtn, setShowShareBtn] = useState(false)
  const [copied, setCopied] = useState(false)
  const [diagramTitle, setDiagramTitle] = useState('')
  const { toggleDiagramList } = useGlobalUI()
  const { user } = useAuth()
  const diagramItem = useSelector((state: any) => state.diagrams.byId[state.diagrams.selectedId])
  const dispatch = useDispatch()

  useEffect(() => {
    if (diagramItem) {
      setDiagramTitle(diagramItem.title)
      setShareId(diagramItem.shares ? diagramItem.shares.share_id : '')
    }
  }, [diagramItem])

  useEffect(() => {
    if (shareId) {
      setShowShareBtn(false)
    } else {
      setShowShareBtn(user.id && diagramItem?.id)
    }
  }, [diagramItem, user, shareId])

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
      const { data } = await res.json()
      setShareId(data.id)
      dispatch(
        editDiagram({
          ...diagramItem,
          shares: { ...data },
        })
      )
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
    setDiagramTitle(event.currentTarget.textContent)
  }

  async function onKeyPressDiagramTitle(event: any) {
    if (event.keyCode === 13) {
      event.preventDefault()
      updateTitle()
      event.target.blur()
    }
  }

  async function updateTitle() {
    const { data } = await supabase
      .from('diagrams')
      .update({ title: diagramTitle || 'Untitled' })
      .eq('id', diagramItem.id)
      .select()
      .single()
    dispatch(editDiagram(data))
  }

  return (
    <div className='sticky top-0 z-10 w-full border-b bg-white px-4 py-1.5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          {showBtnDiagramList && (
            <ActionButton
              icon={<IconLayoutSidebar size={20} />}
              text='Show diagram list'
              variant='secondary'
              onClick={toggleDiagramList}
            />
          )}
          <div className='flex items-center'>
            <h1 className='mr-2 font-medium'>
              <Link href='/'>usediagram.com</Link>
            </h1>
            {diagramItem && (
              <>
                <span className='mr-1'>/</span>
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  role='textbox'
                  onInput={onChangeDiagramTitle}
                  onKeyDown={onKeyPressDiagramTitle}
                  onBlur={updateTitle}
                  className='rounded border border-transparent px-1 text-slate-600 outline-none focus:border-slate-400 focus:ring focus:ring-slate-300'>
                  {diagramItem.title}
                </span>
              </>
            )}
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <div className='mr-6 flex items-center gap-2'>
            {showShareBtn && (
              <ActionButton
                onClick={btnShareHandler}
                icon={<IconShare size={20} />}
                displayText
                text='Share'
                variant='secondary'
                loading={sharing}
              />
            )}
            {shareId && (
              <div
                onClick={btnCopyShareUrlHandler}
                className='ml-2 flex cursor-pointer items-center gap-1 text-sm text-slate-500 hover:text-slate-900'>
                <span className='truncate'>.../s/{shareId}</span>
                {copied ? <IconCheck size={20} /> : <IconLink size={20} />}
              </div>
            )}
          </div>
          {user.id ? (
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
            <Link href='/auth' className='text-sm text-slate-500 hover:text-slate-900 hover:underline'>
              Login / Signup
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

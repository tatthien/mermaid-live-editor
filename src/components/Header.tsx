import ActionButton from '@/components/ActionButton'
import { useDiagrams } from '@/hooks/useDiagrams'
import { useGlobalUI } from '@/hooks/useGlobalUI'
import { Diagram } from '@/types'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { IconMenu2 } from '@tabler/icons-react'
import Link from 'next/link'
import { FocusEvent, KeyboardEvent, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

interface HeaderProps {
  diagram?: Diagram
}

export default function Header({ diagram }: HeaderProps) {
  const session = useSession()
  const supabase = useSupabaseClient()
  const { toggleDiagramList } = useGlobalUI()
  const [title, setTitle] = useState('')
  const { mutate } = useDiagrams()

  useEffect(() => {
    if (!diagram) return
    setTitle(diagram.title)
  }, [diagram])

  async function handleClickLogout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  async function handleKeyDown(event: KeyboardEvent<HTMLSpanElement>) {
    if (event.keyCode === 13) {
      event.preventDefault()
      event.currentTarget.blur()
    }
  }

  async function handleBlur(event: FocusEvent<HTMLSpanElement>) {
    const title = event.currentTarget.textContent || 'Untitled'
    setTitle(title)
    if (diagram) {
      const updatedItem = { ...diagram, title }
      mutate(
        (data: any) => {
          return data.map((item: Diagram) => (item.id === updatedItem.id ? updatedItem : item))
        },
        {
          revalidate: false,
        }
      )

      const res = await fetch(`/api/diagrams/${diagram.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
        }),
      })

      if (!res.ok) {
        // Rollback on error
        mutate((data: any) => {
          return data.map((item: Diagram) => (item.id === diagram.id ? diagram : item))
        })

        toast.error('Cannot update diagram title')
      }
    }
  }

  return (
    <div className='sticky top-0 z-10 w-full border-b bg-white px-4 py-1.5'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <ActionButton
            icon={<IconMenu2 size={20} />}
            text='Show diagram list'
            variant='secondary'
            onClick={toggleDiagramList}
          />
          <div className='flex items-center'>
            <h1 className='mr-2 font-medium'>
              <Link href='/'>usediagram.com</Link>
            </h1>
            {diagram && (
              <>
                <span className='mr-1'>/</span>
                <span
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  role='textbox'
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  className='rounded border border-transparent px-1 text-slate-600 outline-none focus:border-slate-400 focus:ring focus:ring-slate-300'>
                  {title}
                </span>
              </>
            )}
          </div>
        </div>
        <div className='flex items-center gap-3'>
          {session ? (
            <>
              <span className='text-sm'>{session.user.email}</span>
              <Link
                href='#'
                onClick={handleClickLogout}
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

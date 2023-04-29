import { supabase } from '@/lib/supabase'
import { deleteDiagram } from '@/stores/diagrams'
import { IconTrashFilled } from '@tabler/icons-react'
import cx from 'clsx'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import plantumlEncoder from 'plantuml-encoder'
import { useState, MouseEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface DiagramItemProps {
  id: string
}

export default function DiagramItem({ id }: DiagramItemProps) {
  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false)
  const router = useRouter()
  const { slug } = router.query
  const isActive = slug ? id === slug[0] : false
  const dispatch = useDispatch()
  const diagram = useSelector((state: any) => state.diagrams.byId[id])

  const encodedUrl = plantumlEncoder.encode(diagram.content)

  function onClickTrashBtn(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    event.preventDefault()
    setShowDeletionConfirm(true)
    setTimeout(() => setShowDeletionConfirm(false), 2000)
  }

  async function onClickSureBtn(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    event.preventDefault()
    const { error } = await supabase.from('diagrams').delete().eq('id', id)
    if (error) return
    dispatch(deleteDiagram(diagram))
    if (isActive) {
      router.push('/')
    }
  }

  return (
    <Link
      href={`/${id}`}
      className={cx(
        isActive ? 'border-slate-200 bg-slate-100' : 'border-transparent',
        'block cursor-pointer rounded border p-1 hover:bg-slate-100'
      )}>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex w-[calc(100%-24px)] gap-2'>
          <div className='aspect-square shrink-0 rounded border bg-white '>
            <img
              src={`https://usediagram.com/api/png/${encodedUrl}`}
              className='h-12 w-12 object-cover p-0.5'
            />
          </div>
          <div className='truncate'>
            <h2 className='truncate text-sm font-medium'>{diagram.title}</h2>
            <div className='flex gap-2'>
              <div className='text-xs text-slate-400'>
                {format(parseISO(diagram.created_at), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        </div>
        <div>
          {!showDeletionConfirm && (
            <button className='text-slate-400 hover:text-slate-900' onClick={onClickTrashBtn}>
              {<IconTrashFilled size={16} />}
            </button>
          )}
          {showDeletionConfirm && (
            <button className='text-xs text-red-600 hover:underline' onClick={onClickSureBtn}>
              Sure?
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

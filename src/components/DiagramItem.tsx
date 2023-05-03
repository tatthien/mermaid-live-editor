import { useDiagrams } from '@/hooks/useDiagrams'
import { Diagram } from '@/types'
import { IconTrashFilled } from '@tabler/icons-react'
import cx from 'clsx'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import plantumlEncoder from 'plantuml-encoder'
import { useState, MouseEvent } from 'react'
import { toast } from 'react-hot-toast'
import { KeyedMutator } from 'swr'

interface DiagramItemProps {
  item: Diagram
  mutate: KeyedMutator<Diagram[]>
}

export default function DiagramItem({ item, mutate }: DiagramItemProps) {
  const { content, title, id, created_at } = item
  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false)
  const router = useRouter()
  const { slug } = router.query
  const isActive = slug ? id === slug[0] : false
  const { diagrams } = useDiagrams()

  const encodedUrl = plantumlEncoder.encode(content)

  function handleClickTrashBtn(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    event.preventDefault()
    setShowDeletionConfirm(true)
    setTimeout(() => setShowDeletionConfirm(false), 2000)
  }

  async function handleClickSureBtn(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    event.preventDefault()

    // Revalidate
    const updatedDiagrams = diagrams?.filter((diagram: Diagram) => diagram.id !== id)
    mutate(updatedDiagrams, {
      revalidate: false,
    })

    // Delete item
    const res = await fetch(`/api/diagrams/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      mutate(diagrams)
      toast.error('Cannot delete this diagram')
    }

    if (isActive) {
      router.push('/')
    }
  }

  return (
    <Link
      href={`/${id}`}
      className={cx(
        isActive ? 'border-slate-300 bg-slate-100' : 'border-transparent',
        'block cursor-pointer rounded border p-1 hover:bg-slate-100'
      )}>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex w-[calc(100%-24px)] gap-2'>
          <div className='aspect-square shrink-0 rounded border bg-white '>
            <img
              src={`https://usediagram.com/api/png/${encodedUrl}`}
              className='h-12 w-12 object-cover p-0.5'
              alt='Diagram Thumbnail'
            />
          </div>
          <div className='truncate'>
            <h2 className='truncate text-sm font-medium'>{title}</h2>
            <div className='flex gap-2'>
              <div className='text-xs text-slate-400'>{format(parseISO(created_at), 'MMM dd, yyyy')}</div>
            </div>
          </div>
        </div>
        <div>
          {!showDeletionConfirm && (
            <button className='text-slate-400 hover:text-slate-900' onClick={handleClickTrashBtn}>
              {<IconTrashFilled size={16} />}
            </button>
          )}
          {showDeletionConfirm && (
            <button className='text-xs text-red-600 hover:underline' onClick={handleClickSureBtn}>
              Sure?
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

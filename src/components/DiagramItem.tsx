import { setSelectedDiagramId } from '@/stores/diagrams'
import cx from 'clsx'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import plantumlEncoder from 'plantuml-encoder'
import { useDispatch } from 'react-redux'

interface DiagramItemProps {
  item: Record<string, any> // TODO: diagram type
}

export default function DiagramItem({ item }: DiagramItemProps) {
  const encodedUrl = plantumlEncoder.encode(item.content)
  const router = useRouter()
  const { slug } = router.query
  const isActive = slug ? item.id === slug[0] : false
  const dispatch = useDispatch()

  function onClickItem() {
    dispatch(setSelectedDiagramId(item.id))
  }
  return (
    <Link
      href={`/${item.id}`}
      onClick={onClickItem}
      className={cx(
        isActive ? 'border-slate-200 bg-slate-100' : 'border-transparent',
        'block cursor-pointer rounded border p-2 hover:bg-slate-100'
      )}>
      <div className='flex justify-between gap-2'>
        <div className='truncate'>
          <h2 className='truncate text-sm font-medium'>{item.title}</h2>
          <div className='flex gap-2'>
            <div className='text-xs text-slate-400'>{format(parseISO(item.created_at), 'MMM dd, yyyy')}</div>
          </div>
        </div>
        <img src={`https://usediagram.com/api/png/${encodedUrl}`} className='w-12 shrink-0 rounded border' />
      </div>
    </Link>
  )
}

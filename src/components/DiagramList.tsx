import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { addDiagram, fetchDiagram } from '@/stores/diagrams'
import { IconPlus, IconCategory } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import ActionButton from './ActionButton'
import DiagramItem from './DiagramItem'

export default function DiagramList() {
  const [isCreating, setIsCreating] = useState(false)
  const { user } = useAuth()
  const diagrams = useSelector((state: any) => state.diagrams.data)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('diagrams')
        .select('*,shares(*)')
        .order('created_at', { ascending: false })
      dispatch(fetchDiagram(data))
    }
    fetch()
  }, [])

  async function btnAddNewHandler() {
    setIsCreating(true)
    const { data, error } = await supabase
      .from('diagrams')
      .insert({
        title: 'Untitled',
        content: `@startuml\nBob->Alice: Hello\n@enduml`,
        user_id: user.id,
      })
      .select('*,shares(*)')
      .single()

    if (error) {
      alert(error)
    } else {
      dispatch(addDiagram(data))
      router.push(`/${data.id}`)
    }
    setIsCreating(false)
  }

  const listDiagrams =
    diagrams.length === 0 ? (
      <div className='flex flex-col items-center justify-center py-6  text-center text-slate-500'>
        <IconCategory size={40} strokeWidth={1.5} />
        <span className='text-sm'>No diagrams found</span>
      </div>
    ) : (
      diagrams.map((diagram: any) => <DiagramItem item={diagram} key={diagram.id} />)
    )

  return (
    <div>
      <div className='mb-4'>
        <ActionButton
          icon={<IconPlus size={20} />}
          text='Add new'
          displayText
          onClick={btnAddNewHandler}
          variant='secondary'
          className='w-full'
          loading={isCreating}
        />
      </div>
      <div className='h-[calc(100vh-120px)] space-y-2 overflow-y-auto'>{listDiagrams}</div>
    </div>
  )
}

import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { addDiagram, fetchDiagram } from '@/stores/diagrams'
import { diagramArr } from '@/stores/schema'
import { IconCategory, IconEdit } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { normalize } from 'normalizr'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import ActionButton from './ActionButton'
import DiagramItem from './DiagramItem'

export default function DiagramList() {
  const [isCreating, setIsCreating] = useState(false)
  const { user } = useAuth()
  const diagrams = useSelector((state: any) => state.diagrams.diagrams)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('diagrams')
        .select('*,shares(*)')
        .order('created_at', { ascending: false })

      const normalizedData = normalize(data, diagramArr)

      dispatch(fetchDiagram(normalizedData.entities.diagrams))
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

  return (
    <div>
      <div className='mb-4'>
        <ActionButton
          icon={<IconEdit size={20} />}
          text='New diagram'
          displayText
          onClick={btnAddNewHandler}
          variant='secondary'
          className='w-full'
          loading={isCreating}
        />
      </div>
      <div className='h-[calc(100vh-120px)] space-y-2 overflow-y-auto'>
        {!diagrams ? (
          <div className='flex flex-col items-center justify-center py-6  text-center text-slate-500'>
            <IconCategory size={40} strokeWidth={1.5} />
            <span className='text-sm'>No diagrams found</span>
          </div>
        ) : (
          Object.keys(diagrams).map((k) => <DiagramItem item={diagrams[k]} key={diagrams[k].id} />)
        )}
      </div>
    </div>
  )
}

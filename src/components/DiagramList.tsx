import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { addDiagram, setDiagramAllIds, setDiagramById } from '@/stores/diagrams'
import { diagramArr } from '@/stores/schema'
import { IconCategory, IconEdit } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { normalize } from 'normalizr'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'

import ActionButton from './ActionButton'
import DiagramItem from './DiagramItem'

export default function DiagramList() {
  const [isCreating, setIsCreating] = useState(false)
  const { user } = useAuth()
  const diagramIds = useSelector((state: any) => state.diagrams.allIds, shallowEqual)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('diagrams')
        .select('*,shares(*)')
        .order('created_at', { ascending: false })

      const normalizedData = normalize(data, diagramArr)

      dispatch(setDiagramById(normalizedData.entities.diagrams))
      dispatch(setDiagramAllIds(normalizedData.result))
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
      let message = error.message
      if (!user.id) {
        message = 'Login to fully manage your diagrams'
      }
      alert(message)
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
        {diagramIds.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-6  text-center text-slate-500'>
            <IconCategory size={40} strokeWidth={1.5} />
            <span className='text-sm'>No diagrams found</span>
          </div>
        ) : (
          diagramIds.map((id: string) => <DiagramItem id={id} key={id} />)
        )}
      </div>
    </div>
  )
}

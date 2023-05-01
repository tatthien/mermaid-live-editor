import { useCreateDiagramMutation, useGetDiagramsQuery } from '@/services/diagram'
import { useSession } from '@supabase/auth-helpers-react'
import { IconCategory, IconEdit } from '@tabler/icons-react'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/router'

import ActionButton from './ActionButton'
import DiagramItem from './DiagramItem'

export default function DiagramList() {
  const router = useRouter()
  const session = useSession()

  const { data: diagrams, isLoading } = useGetDiagramsQuery()
  const [createDiagram, { isLoading: isCreating }] = useCreateDiagramMutation()

  async function handleAddNew() {
    if (!session) {
      alert('Log in to create a new diagram')
      return
    }

    try {
      const data = await createDiagram().unwrap()
      router.push(`/${data.id}`)
    } catch (err) {
      if (isAxiosError(err) && err.response && err.response.status === 401) {
        alert('Log in to create a new diagram')
      } else {
        alert('Unknown error')
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className='mb-4'>
        <ActionButton
          icon={<IconEdit size={20} />}
          text='New diagram'
          displayText
          onClick={handleAddNew}
          variant='secondary'
          className='w-full'
          loading={isCreating}
        />
      </div>
      <div className='h-[calc(100vh-120px)] space-y-2 overflow-y-auto'>
        {!diagrams || diagrams.allIds.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-6  text-center text-slate-500'>
            <IconCategory size={40} strokeWidth={1.5} />
            <span className='text-sm'>No diagrams found</span>
          </div>
        ) : (
          diagrams.allIds.map((id: string) => <DiagramItem item={diagrams.byId[id]} key={id} />)
        )}
      </div>
    </div>
  )
}

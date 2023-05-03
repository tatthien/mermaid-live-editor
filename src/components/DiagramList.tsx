import { useDiagrams } from '@/hooks/useDiagrams'
import { Diagram } from '@/types'
import { useSession } from '@supabase/auth-helpers-react'
import { IconCategory, IconEdit } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import ActionButton from './ActionButton'
import DiagramItem from './DiagramItem'

export default function DiagramList() {
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const session = useSession()
  const { diagrams, isLoading, mutate } = useDiagrams()

  async function handleAddNew() {
    if (!session) {
      toast.error('Log in to create a new diagram')
      return
    }

    try {
      setIsCreating(true)
      const res = await fetch(`/api/diagrams`, {
        method: 'POST',
      })
      const json = await res.json()
      await mutate((data) => {
        if (!data) return data
        return [json, ...data]
      }, false)
      router.push(`/${json.id}`)
    } catch (err) {
      toast.error('Cannot add a new diagram')
    } finally {
      setIsCreating(false)
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
        {!diagrams?.length ? (
          <div className='flex flex-col items-center justify-center py-6  text-center text-slate-500'>
            <IconCategory size={40} strokeWidth={1.5} />
            <span className='text-sm'>No diagrams found</span>
          </div>
        ) : (
          diagrams.map((diagram: Diagram) => <DiagramItem item={diagram} key={diagram.id} mutate={mutate} />)
        )}
      </div>
    </div>
  )
}

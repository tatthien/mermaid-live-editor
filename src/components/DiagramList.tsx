import { useDiagrams } from '@/hooks/useDiagrams'
import { Diagram } from '@/types'
import { useSession } from '@supabase/auth-helpers-react'
import { IconCategory, IconEdit } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import ActionButton from './ActionButton'
import DiagramItem from './DiagramItem'

const sampleDiagrams = [
  {
    type: 'option',
    key: '0',
    title: 'Simple',
    value: `@startuml

scale 1.5
skinparam backgroundColor transparent

Bob -> Alice: Hello

@enduml
`,
  },
  {
    type: 'option',
    key: 'blank',
    title: 'Blank',
    value: '',
  },
  {
    type: 'option',
    key: 'activity',
    title: 'Activity',
    value: `@startuml

scale 1.5
skinparam backgroundColor transparent

start

:step 1;

if (try) then (true)
  :step 2;
  :step 3;
else (false)
  :error;
  end
endif

stop

@enduml
`,
  },
  {
    type: 'option',
    key: 'use-case',
    title: 'Use case',
    value: `@startuml

scale 1.5
skinparam backgroundColor transparent

actor A
actor B

A -up-> (up)
A -right-> (center)
A -down-> (down)
A -left-> (left)

B -up-> (up)
B -left-> (center)
B -right-> (right)
B -down-> (down)

@enduml
`,
  },
  {
    type: 'Option',
    key: 'class',
    title: 'Class',
    value: `@startuml

scale 1.5
skinparam backgroundColor transparent

class Car {
  color
  model
  +start()
  #run()
  #stop()
}

Car <|- Bus
Car *-down- Tire
Car *-down- Engine
Bus o-down- Driver

@enduml
`,
  },
  {
    type: 'option',
    key: 'mindmap',
    title: 'Mindmap',
    value: `@startmindmap

skinparam backgroundColor transparent

* JAMStack
** Site generator
*** Next.js
*** Hugo
*** Gatsby
*** Docusaurus
** Headless CMS
*** Strapi
*** Directus
*** Payload CMS

@endmindmap
`,
  },
  {
    type: 'option',
    key: 'yaml',
    title: 'YAML',
    value: `@startyaml

skinparam backgroundColor transparent

Hello:
  - Thing 1
  - Thing 2    
  - Thing 3  

World:
  - Thing 1
  - Thing 2    
  - Thing 3   

@endyaml
`,
  },
]

export default function DiagramList() {
  const [isCreating, setIsCreating] = useState(false)
  const [showSampleDiagrams, setShowSampleDiagrams] = useState(false)
  const router = useRouter()
  const session = useSession()
  const { diagrams, isLoading, mutate } = useDiagrams()

  async function handleAddNew() {
    if (!session) {
      toast.error('Log in to create a new diagram')
      return
    }

    setShowSampleDiagrams(!showSampleDiagrams)
  }

  async function addDiagram(content: string) {
    setShowSampleDiagrams(false)

    try {
      setIsCreating(true)
      const res = await fetch(`/api/diagrams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
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
      <div className='relative mb-4'>
        <ActionButton
          icon={<IconEdit size={20} />}
          text='New diagram'
          displayText
          onClick={handleAddNew}
          variant='secondary'
          className='w-full'
          loading={isCreating}
        />
        {showSampleDiagrams && (
          <div className='absolute left-0 right-0 mt-2 rounded border bg-white shadow'>
            <ul className='px-2 py-2'>
              {sampleDiagrams.map(({ key, title, value }) => (
                <li
                  className='cursor-pointer rounded px-1.5 py-1 text-sm transition hover:bg-slate-200 hover:text-slate-900'
                  key={key}
                  onClick={() => {
                    addDiagram(value)
                  }}>
                  {title}
                </li>
              ))}
            </ul>
          </div>
        )}
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

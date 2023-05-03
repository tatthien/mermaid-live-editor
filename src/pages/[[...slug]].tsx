import ChatGPT from '@/components/ChatGPT'
import DiagramList from '@/components/DiagramList'
import Editor from '@/components/Editor'
import Header from '@/components/Header'
import Preview from '@/components/Preview'
import Sidebar from '@/components/Sidebar'
import { useDiagrams } from '@/hooks/useDiagrams'
import { useGlobalUI } from '@/hooks/useGlobalUI'
import { Diagram } from '@/types'
import { Allotment } from 'allotment'
import cx from 'clsx'
import { debounce } from 'lodash'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const { slug } = router.query
  const id = slug ? slug[0] : ''

  const [content, setContent] = useState('')
  const [path, setPath] = useState('')
  const [modelContent, setModelContent] = useState('')
  const [diagram, setDiagram] = useState<Diagram>()
  const { showSidebar, showDiagramList } = useGlobalUI()
  const { diagrams, mutate } = useDiagrams()

  useEffect(() => {
    if (!diagrams?.length || !id || !router.isReady) return

    const diagram = diagrams?.find((item) => item.id === id)
    if (diagram) {
      setDiagram(diagram)
    } else {
      router.push('/404')
    }
  }, [diagrams, router, id])

  useEffect(() => {
    if (diagram) {
      setContent(diagram.content)
      setPath(diagram.id)
    }
  }, [diagram])

  const onChange = async (value: string | undefined) => {
    setContent(String(value))

    if (id) {
      const updatedItem = { ...diagram, content: value }
      mutate(
        (data: any) => {
          return data.map((item: Diagram) => (item.id === updatedItem.id ? updatedItem : item))
        },
        {
          revalidate: false,
        }
      )

      const res = await fetch(`/api/diagrams/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: value,
        }),
      })

      if (!res.ok) {
        mutate((data: any) => {
          return data.map((item: Diagram) => (item.id === diagram?.id ? diagram : item))
        })
      }
    }
  }

  const handleEditorChange = debounce(onChange, 400)

  async function handleMessage(value: string) {
    setModelContent(value)
    onChange(value)
  }

  return (
    <>
      <Head>
        <title>{diagram ? diagram.title : 'Untitled'} - UseDiagram</title>
      </Head>
      <div className={`${inter.className} flex h-screen flex-col`}>
        <Header diagram={diagram} />
        <main className='relative flex flex-1'>
          <div
            className={cx(showDiagramList ? 'block' : 'hidden', 'w-[280px] border-r bg-slate-50 px-2 py-3')}>
            <DiagramList />
          </div>
          <Allotment>
            <Allotment.Pane visible={showSidebar} preferredSize={450}>
              <Sidebar>
                <>
                  <Editor
                    content={content}
                    modelContent={modelContent}
                    path={path}
                    onChange={handleEditorChange}
                  />
                </>
              </Sidebar>
            </Allotment.Pane>
            <Allotment.Pane>
              <Preview content={content} />
              <div className='absolute bottom-0 left-0 right-0'>
                <ChatGPT onMessage={handleMessage} content={content} />
              </div>
            </Allotment.Pane>
          </Allotment>
        </main>
      </div>
    </>
  )
}

import ChatGPT from '@/components/ChatGPT'
import DiagramList from '@/components/DiagramList'
import Editor from '@/components/Editor'
import Header from '@/components/Header'
import Preview from '@/components/Preview'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/hooks/useAuth'
import { useGlobalUI } from '@/hooks/useGlobalUI'
import { supabase } from '@/lib/supabase'
import { editDiagram, setSelectedDiagramId } from '@/stores/diagrams'
import { Allotment } from 'allotment'
import cx from 'clsx'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [content, setContent] = useState('')
  const [contentId, setContentId] = useState('')
  const { showSidebar, showDiagramList } = useGlobalUI()
  const { user } = useAuth()
  const router = useRouter()
  const { slug } = router.query
  const dispatch = useDispatch()
  const diagramItem = useSelector((state: any) => state.diagrams.byId[state.diagrams.selectedId])

  useEffect(() => {
    if (!router.isReady || !slug) return
    const fetch = async () => {
      const { data, error } = await supabase.from('diagrams').select('*,shares(*)').eq('id', slug[0]).single()
      if (error) {
        router.push('/404')
      }
      if (data) {
        dispatch(setSelectedDiagramId(data.id))
      }
    }
    if (slug) {
      fetch()
    }
  }, [router.isReady])

  useEffect(() => {
    if (diagramItem) {
      setContent(diagramItem.content)
      setContentId(new Date().getTime().toString())
    }
  }, [diagramItem])

  useEffect(() => {
    if (slug) {
      dispatch(setSelectedDiagramId(slug[0]))
    }
  }, [slug])

  async function updateDiagramContent(value: string, slug: string) {
    const { data } = await supabase
      .from('diagrams')
      .update({ content: value })
      .eq('id', slug)
      .select('*,shares(*)')
      .single()
    await supabase.from('shares').update({ content: value }).eq('diagram_id', slug)
    return data
  }

  async function onEditorChange(value: any) {
    if (slug) {
      const data = await updateDiagramContent(String(value), slug[0])
      if (data) {
        dispatch(editDiagram(data))
      }
    } else {
      setContent(value)
    }
  }

  async function onMessage(value: any) {
    setContent(value)
    setContentId(new Date().getTime().toString())

    if (slug) {
      const data = await updateDiagramContent(String(value), slug[0])
      if (data) {
        dispatch(editDiagram(data))
      }
    }
  }

  return (
    <>
      <Head>
        <title>{diagramItem ? diagramItem.title : 'Untitled'} - UseDiagram</title>
      </Head>
      <div className={`${inter.className} flex h-screen flex-col`}>
        <Header content={content} />
        <main className='relative flex flex-1'>
          <div className={cx(showDiagramList ? 'block' : 'hidden', 'w-[280px] border-r px-2 py-3')}>
            <DiagramList />
          </div>
          <Allotment>
            <Allotment.Pane visible={showSidebar} preferredSize={450}>
              <Sidebar>
                <>
                  <Editor path={contentId} content={content} onChange={onEditorChange} />
                </>
              </Sidebar>
            </Allotment.Pane>
            <Allotment.Pane>
              <Preview content={content} />
              {user.id && (
                <div className='absolute bottom-0 left-0 right-0'>
                  <ChatGPT onMessage={onMessage} />
                </div>
              )}
            </Allotment.Pane>
          </Allotment>
        </main>
      </div>
    </>
  )
}

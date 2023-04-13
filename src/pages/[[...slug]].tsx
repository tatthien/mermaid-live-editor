import DiagramList from '@/components/DiagramList'
import Editor from '@/components/Editor'
import Header from '@/components/Header'
import Preview from '@/components/Preview'
import Sidebar from '@/components/Sidebar'
import { useGlobalUI } from '@/hooks/useGlobalUI'
import { supabase } from '@/lib/supabase'
import { setDiagramItem } from '@/stores/diagrams'
import { Allotment } from 'allotment'
import cx from 'clsx'
import { GetServerSidePropsContext } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [content, setContent] = useState('')
  const [contentId, setContentId] = useState('')
  const { showSidebar, showDiagramList } = useGlobalUI()
  const router = useRouter()
  const { slug } = router.query
  const dispatch = useDispatch()
  const diagramItem = useSelector((state: any) => state.diagrams.item)

  useEffect(() => {
    if (!router.isReady || !slug) return
    const fetch = async () => {
      const { data } = await supabase.from('diagrams').select('*,shares(*)').eq('id', slug[0]).single()
      dispatch(setDiagramItem(data))
    }
    if (slug) {
      fetch()
    }
  }, [router.isReady])

  useEffect(() => {
    if (diagramItem) {
      setContent(diagramItem.content)
      setContentId(diagramItem.id)
    }
  }, [diagramItem])

  async function onEditorChange(value: any) {
    if (slug) {
      const { data } = await supabase
        .from('diagrams')
        .update({ content: value })
        .eq('id', slug[0])
        .select('*,shares(*)')
        .single()
      await supabase.from('shares').update({ content: value }).eq('diagram_id', slug[0])
      if (data) {
        dispatch(setDiagramItem(data))
      }
    }
  }

  return (
    <>
      <Head>
        <title>Use Diagram | Visualize your ideas using Mermaid</title>
      </Head>
      <div className={`${inter.className} flex h-screen flex-col`}>
        <Header content={content} />
        <main className='relative flex flex-1'>
          <div className={cx(showDiagramList ? 'block' : 'hidden', 'w-[260px] border-r px-2 py-3')}>
            <DiagramList />
          </div>
          <Allotment>
            <Allotment.Pane visible={showSidebar} preferredSize={450}>
              <Sidebar>
                <Editor path={contentId} content={content} onChange={onEditorChange} />
              </Sidebar>
            </Allotment.Pane>
            <Allotment.Pane>
              <Preview content={content} />
            </Allotment.Pane>
          </Allotment>
        </main>
      </div>
    </>
  )
}

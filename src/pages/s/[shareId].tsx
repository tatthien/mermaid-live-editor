import Editor from '@/components/Editor'
import Header from '@/components/Header'
import Preview from '@/components/Preview'
import Sidebar from '@/components/Sidebar'
import { useGlobalUI } from '@/hooks/useGlobalUI'
import { createClient } from '@supabase/supabase-js'
import { Allotment } from 'allotment'
import { GetServerSidePropsContext } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

interface IHomeProps {
  diagram: string
  shareId: string
}

export default function Home({ shareId, diagram }: IHomeProps) {
  const [content, setContent] = useState('')
  const { showSidebar } = useGlobalUI()

  useEffect(() => {
    setContent(diagram)
  }, [diagram])

  return (
    <>
      <Head>
        <title>Use Diagram | Visualize your ideas using Mermaid</title>
      </Head>
      <div className={`${inter.className} flex h-screen flex-col`}>
        <Header showBtnDiagramList={false} shareId={shareId} content={content} />
        <main className='relative flex flex-1'>
          <Allotment>
            <Allotment.Pane visible={showSidebar} preferredSize={450}>
              <Sidebar>
                <Editor
                  content={content}
                  path={shareId}
                  onChange={(value: string | undefined) => setContent(String(value))}
                  readOnly={true}
                />
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context
  const shareId = params?.shareId
  const client = createClient(
    String(process.env.NEXT_PUBLIC_SP_PROJECT_URL),
    String(process.env.NEXT_PUBLIC_SP_ANON_KEY)
  )
  const { data, error } = await client.from('shares').select('*').eq('share_id', shareId).limit(1)
  if (error || !data.length) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      diagram: data[0].content,
      shareId: shareId,
    },
  }
}

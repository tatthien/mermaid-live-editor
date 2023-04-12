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

export default function Home(props: IHomeProps) {
  const [content, setContent] = useState('')
  const [shareId, setShareId] = useState(props.shareId)
  const { showSidebar } = useGlobalUI()

  useEffect(() => {
    setContent(props.diagram)
  }, [])

  return (
    <>
      <Head>
        <title>Use Diagram | Visualize your ideas using Mermaid</title>
      </Head>
      <div className={`${inter.className} flex h-screen flex-col`}>
        <Header shareId={shareId} content={content} onShared={(id) => setShareId(id)} />
        <main className='relative flex-1'>
          <Allotment>
            <Allotment.Pane visible={showSidebar} preferredSize={450}>
              <Sidebar>
                <Editor
                  content={content}
                  onChange={(value: string | undefined) => setContent(String(value))}
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
  if (!params?.slug) {
    return {
      props: {
        diagram: `@startuml

Alice -> Bob: How are you?
Bob --> Alice: I'm good, thanks

@enduml
`,
        shareId: '',
      },
    }
  }

  const client = createClient(String(process.env.SP_PROJECT_URL), String(process.env.SP_ANON_KEY))
  const { data, error } = await client.from('shares').select('content').eq('share_id', params?.slug)
  if (error || !data.length) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      diagram: data[0].content,
      shareId: params?.slug,
    },
  }
}

import ActionButton from '@/components/action-button'
import CheckIcon from '@/components/icons/check'
import DownloadIcon from '@/components/icons/download'
import LayoutFullIcon from '@/components/icons/layout-full'
import LayoutSidebarIcon from '@/components/icons/layout-sidebar'
import LinkIcon from '@/components/icons/link'
import MinusIcon from '@/components/icons/minus'
import PlusIcon from '@/components/icons/plus'
import RefreshIcon from '@/components/icons/refresh'
import ShareIcon from '@/components/icons/share'
import Editor from '@monaco-editor/react'
import { createClient } from '@supabase/supabase-js'
import isEqual from 'lodash/isEqual'
import mermaid from 'mermaid'
import type { MermaidConfig } from 'mermaid'
import { GetServerSidePropsContext } from 'next'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const inter = Inter({ subsets: ['latin'] })

export default function Home(props: { diagram: string; shareId: string }) {
  const router = useRouter()
  const previewRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef(null)
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState(props.diagram)
  const [hideSidebar, setHideSidebar] = useState(false)
  const [disableShareButton, setDisableShareButton] = useState(true)
  const [sharing, setSharing] = useState(false)
  const [shareId, setShareId] = useState(props.shareId)
  const [copied, setCopied] = useState(false)

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    tabSize: 2,
  }

  mermaid.mermaidAPI.initialize({
    startOnLoad: true,
    securityLevel: 'strict',
    theme: 'neutral',
    flowchart: {
      useMaxWidth: false,
    },
    htmlLabels: true,
  } as MermaidConfig)

  useEffect(() => {
    setContent(props.diagram)
  }, [])

  useEffect(() => {
    if (content && previewRef.current) {
      mermaid.mermaidAPI.render('preview', content).then(({ svg }) => {
        previewRef.current.innerHTML = svg
      })
    }
  }, [content])

  useEffect(() => {
    if (content === '' || isEqual(content, originalContent)) {
      setDisableShareButton(true)
    } else {
      setDisableShareButton(false)
    }
  }, [content, originalContent])

  function handleEditorChange(value: any) {
    setContent(value)
  }

  function btnDownloadSVGHandler() {
    if (previewRef.current) {
      const svg = previewRef.current.querySelector('svg')
      const blob = new Blob([String(svg?.outerHTML)], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      const date = new Date()
      downloadLink.download = `mermaid-${date.getTime().toString()}.svg`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(url)
    }
  }

  async function btnShareHandler() {
    try {
      setSharing(true)
      const res = await fetch(`/api/share`, {
        method: 'POST',
        body: JSON.stringify({
          content: content,
        }),
      })
      const { id } = await res.json()
      setShareId(id)
      setOriginalContent(content)
      router.push(`/${id}`)
    } catch (err) {
      console.error(err)
    }
    setSharing(false)
  }

  async function btnCopyShareUrlHandler() {
    try {
      const { asPath } = router
      navigator.clipboard.writeText(process.env.NEXT_PUBLIC_BASE_URL + asPath)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 500)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Head>
        <title>Mermaid Live Editor</title>
      </Head>
      <div className={`${inter.className} flex h-screen flex-col`}>
        <div className='sticky top-0 z-10 w-full border-b bg-white px-4 py-1.5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h1 className='font-medium'>Mermaid Live Editor</h1>
              <ActionButton
                onClick={btnShareHandler}
                icon={<ShareIcon />}
                displayText
                text='Share'
                loading={sharing}
                disabled={disableShareButton}
              />
              {shareId !== '' && (
                <div
                  onClick={btnCopyShareUrlHandler}
                  className='ml-2 flex cursor-pointer items-center gap-1 text-sm text-slate-500 hover:text-slate-900'>
                  <span className='truncate'>.../{shareId}</span>
                  {copied ? <CheckIcon /> : <LinkIcon />}
                </div>
              )}
            </div>
            <div>
              <div className='border-state-600 flex items-center gap-1 rounded-md border px-1 py-1 shadow-sm'>
                <button
                  onClick={() => setHideSidebar(false)}
                  className={`${
                    hideSidebar === false ? 'text-pink-500' : 'text-slate-400 hover:text-slate-600'
                  } transition`}>
                  <LayoutSidebarIcon />
                </button>
                <button
                  onClick={() => setHideSidebar(true)}
                  className={`${
                    hideSidebar ? 'text-pink-500' : 'text-slate-400 hover:text-slate-600'
                  } transition`}>
                  <LayoutFullIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
        <main className='relative grid flex-1 grid-cols-12'>
          <div className={`${hideSidebar ? 'hidden' : 'col-span-4 md:col-span-3'} border-r`}>
            <div>
              <Editor
                height='calc(100vh - 43px)'
                defaultValue={content}
                options={editorOptions}
                onChange={handleEditorChange}
                onMount={(editor) => (editorRef.current = editor)}
              />
            </div>
          </div>
          <div
            className={`${
              hideSidebar ? 'col-span-12' : 'col-span-8 md:col-span-9'
            } relative h-full bg-gray-50`}>
            <TransformWrapper minScale={0.5} centerZoomedOut={true} centerOnInit={true}>
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent contentClass='bg-dotted tr-comp' wrapperClass='tr-wrapper'>
                    <div className='flex h-full w-full items-center justify-center'>
                      <div ref={previewRef} key='preview'></div>
                    </div>
                  </TransformComponent>
                  <div className='absolute right-[1rem] top-[1rem]'>
                    <div className='flex gap-1'>
                      <ActionButton
                        onClick={btnDownloadSVGHandler}
                        variant='secondary'
                        icon={<DownloadIcon />}
                        displayText={true}
                        text='SVG'
                      />
                    </div>
                  </div>
                  <div className='absolute bottom-[1rem] left-[1rem]'>
                    <div className='flex flex-col gap-1'>
                      <ActionButton
                        onClick={() => zoomIn()}
                        variant='secondary'
                        icon={<PlusIcon />}
                        text='Zoom in'
                      />
                      <ActionButton
                        onClick={() => zoomOut()}
                        variant='secondary'
                        icon={<MinusIcon />}
                        text='Zoom out'
                      />
                      <ActionButton
                        onClick={() => resetTransform()}
                        variant='secondary'
                        icon={<RefreshIcon />}
                        text='Reset'
                      />
                    </div>
                  </div>
                </>
              )}
            </TransformWrapper>
          </div>
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
        diagram: `flowchart TD
  A[Start] --> B{Is it?}
  B -- Yes --> C[OK]
  C --> D[Rethink]
  D --> B
  B -- No ----> E[End]
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

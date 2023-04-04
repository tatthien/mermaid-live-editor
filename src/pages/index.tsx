import ActionButton from '@/components/action-button'
import DownloadIcon from '@/components/icons/download'
import LayoutFullIcon from '@/components/icons/layout-full'
import LayoutSidebarIcon from '@/components/icons/layout-sidebar'
import MinusIcon from '@/components/icons/minus'
import PlusIcon from '@/components/icons/plus'
import RefreshIcon from '@/components/icons/refresh'
import Editor from '@monaco-editor/react'
import mermaid from 'mermaid'
import type { MermaidConfig } from 'mermaid'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useEffect, useRef, useState, MouseEventHandler, ReactNode } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef(null)
  const [content, setContent] = useState('')
  const [hideSidebar, setHideSidebar] = useState(false)

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    tabSize: 2,
  }

  mermaid.initialize({
    startOnLoad: true,
    securityLevel: 'strict',
    theme: 'neutral',
    flowchart: {
      useMaxWidth: false,
    },
    htmlLabels: true,
  } as MermaidConfig)

  useEffect(() => {
    if (previewRef.current && content) {
      mermaid.contentLoaded()
      previewRef.current.removeAttribute('data-processed')
    }
  }, [content])

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

  return (
    <>
      <Head>
        <title>Mermaid Live Editor</title>
      </Head>
      <div className={`${inter.className} flex h-screen flex-col`}>
        <div className='sticky top-0 z-10 w-full border-b bg-white px-4 py-1.5'>
          <div className='flex items-center justify-between'>
            <div className='font-semibold'>Mermaid Live Editor</div>
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
                      <div ref={previewRef} className='mermaid'>
                        {content}
                      </div>
                    </div>
                  </TransformComponent>
                  <div className='absolute right-[1rem] top-[1rem]'>
                    <div className='flex gap-1'>
                      <ActionButton
                        onClick={btnDownloadSVGHandler}
                        icon={<DownloadIcon />}
                        displayText={true}
                        text='SVG'
                      />
                    </div>
                  </div>
                  <div className='absolute bottom-[1rem] left-[1rem]'>
                    <div className='flex flex-col gap-1'>
                      <ActionButton onClick={() => zoomIn()} icon={<PlusIcon />} text='Zoom in' />
                      <ActionButton onClick={() => zoomOut()} icon={<MinusIcon />} text='Zoom out' />
                      <ActionButton onClick={() => resetTransform()} icon={<RefreshIcon />} text='Reset' />
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

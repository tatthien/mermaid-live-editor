import DownloadIcon from '@/components/icons/download'
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

const ActionButton = (props: {
  icon: ReactNode
  text: string
  displayText?: boolean
  onClick: MouseEventHandler
}) => {
  const displayText = props.displayText ?? false
  return (
    <button
      className={`${
        displayText ? 'px-1.5 py-1' : 'p-0.5'
      } inline-flex cursor-pointer items-center justify-center gap-1 rounded border border-slate-200 bg-white text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring focus:ring-slate-300 focus:ring-offset-1`}
      onClick={props.onClick}
      aria-label={`${props.text} button`}>
      {props.icon} {displayText && props.text}
    </button>
  )
}

export default function Home() {
  const previewRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef(null)
  const [content, setContent] = useState('')

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
      <div className={`${inter.className} flex h-screen flex-col overflow-y-hidden`}>
        <div className='sticky top-0 z-10 w-full border-b px-2 py-1'>
          <div className='font-semibold'>Mermaid Live Editor</div>
        </div>
        <main className='relative grid flex-1 grid-cols-12'>
          <div className='col-span-4 border-r md:col-span-3'>
            <div>
              <Editor
                height='100vh'
                options={editorOptions}
                onChange={handleEditorChange}
                onMount={(editor) => (editorRef.current = editor)}
              />
            </div>
          </div>
          <div className='relative col-span-8 h-full bg-gray-50 md:col-span-9'>
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
                  <div className='absolute right-[20px] top-[20px]'>
                    <div className='flex gap-1'>
                      <ActionButton
                        onClick={btnDownloadSVGHandler}
                        icon={<DownloadIcon />}
                        displayText={true}
                        text='SVG'
                      />
                    </div>
                  </div>
                  <div className='absolute bottom-[60px] left-[20px]'>
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

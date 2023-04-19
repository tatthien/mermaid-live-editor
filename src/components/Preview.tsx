import ActionButton from '@/components/ActionButton'
import { IconDownload, IconMinus, IconPlus, IconRefresh, IconLoader } from '@tabler/icons-react'
import axios from 'axios'
import DOMPurify from 'dompurify'
import plantumlEncoder from 'plantuml-encoder'
import { useRef, useEffect, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

interface IPreviewProps {
  content: string
}

export default function Preview({ content }: IPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [isDownloadingPng, setIsDownloadingPng] = useState(false)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  useEffect(() => {
    if (!previewRef.current) return
    if (content) {
      const encodedUrl = plantumlEncoder.encode(content)
      setIsGeneratingPreview(true)
      axios
        .get(`/api/svg/${encodedUrl}`)
        .then((res) => {
          const html = DOMPurify.sanitize(res.data.data)
          if (previewRef.current !== null) {
            previewRef.current.innerHTML = html
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setIsGeneratingPreview(false))
    } else {
      previewRef.current.innerHTML = ''
    }
  }, [content])

  function downloadFile(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = fileName
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(url)
  }

  function btnDownloadSVGHandler() {
    if (previewRef.current) {
      const svg = previewRef.current.querySelector('svg')
      const blob = new Blob([String(svg?.outerHTML)], { type: 'image/svg+xml;charset=utf-8' })
      downloadFile(blob, `plantuml-${new Date().getTime().toString()}.svg`)
    }
  }

  async function btnDownloadPNGHandler() {
    if (previewRef.current) {
      setIsDownloadingPng(true)
      const encodedUrl = plantumlEncoder.encode(content)
      const { data } = await axios.get(`/api/png/${encodedUrl}`, { responseType: 'blob' })
      downloadFile(data, `plantuml-${new Date().getTime().toString()}.png`)
      setIsDownloadingPng(false)
    }
  }

  return (
    <div className='relative h-full'>
      <TransformWrapper minScale={0.5} centerZoomedOut={true} centerOnInit={true}>
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent contentClass='tr-comp bg-dotted' wrapperClass='tr-wrapper'>
              <div className='flex h-full w-full items-center justify-center'>
                <div ref={previewRef} key='preview'></div>
              </div>
            </TransformComponent>
            <div className='absolute right-[1rem] top-[1rem]'>
              <div className='flex gap-2'>
                <ActionButton
                  onClick={btnDownloadSVGHandler}
                  variant='secondary'
                  icon={<IconDownload size={20} />}
                  displayText={true}
                  text='SVG'
                />
                <ActionButton
                  onClick={btnDownloadPNGHandler}
                  variant='secondary'
                  icon={<IconDownload size={20} />}
                  displayText={true}
                  loading={isDownloadingPng}
                  text='PNG'
                />
              </div>
            </div>
            {isGeneratingPreview && (
              <div className='absolute left-[50%] top-[50%] flex -translate-x-[50%] -translate-y-[50%] items-center gap-2 rounded-md bg-white p-4'>
                <span className='inline-flex animate-spin text-slate-500'>
                  <IconLoader size={20} />
                </span>
                <span>Loading...</span>
              </div>
            )}
            <div className='absolute left-[1rem] top-[1rem]'>
              <div className='flex flex-col gap-1'>
                <ActionButton
                  onClick={() => zoomIn()}
                  variant='secondary'
                  icon={<IconPlus size={20} />}
                  text='Zoom in'
                />
                <ActionButton
                  onClick={() => zoomOut()}
                  variant='secondary'
                  icon={<IconMinus size={20} />}
                  text='Zoom out'
                />
                <ActionButton
                  onClick={() => resetTransform()}
                  variant='secondary'
                  icon={<IconRefresh size={20} />}
                  text='Reset'
                />
              </div>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}

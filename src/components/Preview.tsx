import ActionButton from '@/components/ActionButton'
import DownloadIcon from '@/components/icons/DownloadIcon'
import MinusIcon from '@/components/icons/MinusIcon'
import PlusIcon from '@/components/icons/PlusIcon'
import RefreshIcon from '@/components/icons/RefreshIcon'
import axios from 'axios'
import DOMPurify from 'dompurify'
import plantumlEncoder from 'plantuml-encoder'
import { useRef, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

interface IPreviewProps {
  content: string
}

export default function Preview({ content }: IPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (content && previewRef.current) {
      const encodedUrl = plantumlEncoder.encode(content)
      axios
        .get(`http://www.plantuml.com/plantuml/svg/${encodedUrl}`)
        .then((res) => {
          const html = DOMPurify.sanitize(res.data)
          if (previewRef.current !== null) {
            previewRef.current.innerHTML = html
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [content])

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
  )
}

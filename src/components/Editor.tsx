import MonacoEditor from '@monaco-editor/react'
import { debounce } from 'lodash'
import { useRef } from 'react'

import RefreshIcon from './icons/RefreshIcon'

interface EditorProps {
  content: string
  onChange: (value: string | undefined) => void
}

export default function Editor({ content, onChange }: EditorProps) {
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    tabSize: 2,
  }

  const onEditorChange = debounce((value) => {
    onChange(value)
  }, 400)

  return (
    <MonacoEditor
      height='calc(100vh - 43px)'
      defaultValue={content}
      loading={
        <span className='animate animate-spin text-slate-600'>
          <RefreshIcon />
        </span>
      }
      options={editorOptions}
      onChange={onEditorChange}
    />
  )
}

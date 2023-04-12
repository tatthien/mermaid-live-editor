import MonacoEditor from '@monaco-editor/react'
import { debounce } from 'lodash'

import LoaderIcon from './icons/LoaderIcon'

interface EditorProps {
  content: string
  onChange: (value: string | undefined) => void
}

export default function Editor({ content, onChange }: EditorProps) {
  const editorOptions = {
    automaticLayout: true,
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
        <span className='animate-spin text-slate-500'>
          <LoaderIcon />
        </span>
      }
      options={editorOptions}
      onChange={onEditorChange}
      defaultLanguage='apex'
    />
  )
}

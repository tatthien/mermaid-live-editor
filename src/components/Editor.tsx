import MonacoEditor from '@monaco-editor/react'
import { useRef } from 'react'

interface IEditorProps {
  content: string
  onChange: (value: string | undefined) => void
}

export default function Editor({ content, onChange }: IEditorProps) {
  const editorRef = useRef(null)
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    tabSize: 2,
  }

  return (
    <MonacoEditor
      height='calc(100vh - 43px)'
      defaultValue={content}
      options={editorOptions}
      onChange={onChange}
      onMount={(editor) => (editorRef.current = editor)}
    />
  )
}

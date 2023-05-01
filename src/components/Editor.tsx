import MonacoEditor from '@monaco-editor/react'
import { IconLoader } from '@tabler/icons-react'
import { useEffect, useRef } from 'react'

interface EditorProps {
  content: string
  modelContent?: string
  path?: string
  onChange: (value: string | undefined) => void
  readOnly?: boolean
}

export default function Editor({ content, modelContent, path, onChange, readOnly }: EditorProps) {
  const editorRef = useRef<any>(null)
  const editorOptions = {
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    tabSize: 2,
    readOnly,
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(modelContent)
    }
  }, [modelContent])

  const onEditorChange = (value: string | undefined) => {
    onChange(value)
  }

  const onEditorMounted = (editor: any) => {
    editorRef.current = editor
  }

  return (
    <MonacoEditor
      height='calc(100vh - 43px)'
      defaultValue={content}
      path={path}
      loading={
        <span className='animate-spin text-slate-500'>
          <IconLoader size={20} />
        </span>
      }
      options={editorOptions}
      onChange={onEditorChange}
      onMount={onEditorMounted}
      defaultLanguage='apex'
    />
  )
}

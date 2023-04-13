import MonacoEditor from '@monaco-editor/react'
import { IconLoader } from '@tabler/icons-react'
import { debounce } from 'lodash'

interface EditorProps {
  content: string
  path: string
  onChange: (value: string | undefined) => void
  readOnly?: boolean
}

export default function Editor({ content, path, onChange, readOnly }: EditorProps) {
  const editorOptions = {
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 14,
    tabSize: 2,
    readOnly,
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
          <IconLoader size={20} />
        </span>
      }
      path={path}
      options={editorOptions}
      onChange={onEditorChange}
      defaultLanguage='apex'
    />
  )
}

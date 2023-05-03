import { IconSparkles, IconLoader, IconCircleKeyFilled, IconSettings, IconCircleX } from '@tabler/icons-react'
import axios, { isAxiosError } from 'axios'
import { useState, KeyboardEvent, useRef, useEffect } from 'react'
import { toast } from 'react-hot-toast'

import ActionButton from './ActionButton'

interface ChatGPTProps {
  onMessage: (value: string) => void
  content: string
}

const initialSettings = {
  model: 'gpt-3.5-turbo',
  temperature: 0.5,
}

export default function ChatGPT({ onMessage, content }: ChatGPTProps) {
  const apiKeyInputRef = useRef<HTMLInputElement>(null)
  const [showSettings, setShowSettings] = useState<boolean>()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditingKey, setIsEditingKey] = useState(false)
  const [isSavingApiKey, setIsSavingApiKey] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [code, setCode] = useState('')
  const [settingsForm, setSettingsForm] = useState(initialSettings)

  useEffect(() => {
    const value = localStorage.getItem('UD_showSettings')
    const key = localStorage.getItem('UD_apiKey')
    const settings = localStorage.getItem('UD_settings')

    if (value) {
      setShowSettings(value === 'true')
    }

    if (key) {
      setApiKey(key)
    }

    if (settings) {
      setSettingsForm(JSON.parse(settings))
    }
  }, [])

  useEffect(() => {
    if (typeof showSettings !== 'undefined') {
      localStorage.setItem('UD_showSettings', String(showSettings))
    }
  }, [showSettings])

  useEffect(() => {
    setCode(content)
  }, [content])

  useEffect(() => {
    if (settingsForm !== initialSettings) {
      localStorage.setItem('UD_settings', JSON.stringify(settingsForm))
    }
  }, [settingsForm])

  async function handleMsgInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      if (isLoading) return
      const value = event.currentTarget.value.trim()
      if (value === '') return
      event.currentTarget.value = ''
      setIsLoading(true)
      try {
        const { data } = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: settingsForm.model,
            messages: [
              {
                role: 'system',
                content: `Understand the PLANTUML code below. Then help users to modify the PLANTUML code. The response must be a valid PLANTUML code. ONLY respond the code in the markdown code block. DO NOT explain why. Here is the code:\n\n${
                  '```\n' + code + '\n```'
                }`,
              },
              {
                role: 'user',
                content: String(value),
              },
            ],
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 300,
            stream: false,
            temperature: Number(settingsForm.temperature),
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        )

        const result = data?.choices?.[0]?.message?.content ?? '```ERROR```'

        // get plantuml code from the result
        const regex = /```(?:plantuml|)\n([\s\S]*?)```/
        const matches = result.match(regex)
        if (matches[1]) {
          setCode(matches[1])
          onMessage(matches[1])
        }
      } catch (err) {
        if (isAxiosError(err) && err.response) {
          if (err.status) {
            toast.error('Wrong API key')
          } else {
            toast.error(err.response.data.error.message)
          }
        }
      }
      setIsLoading(false)
    }
  }

  async function handleBtnSaveApiKey() {
    const key = apiKeyInputRef.current?.value.trim()
    if (!key) return
    setIsSavingApiKey(true)
    try {
      await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: 'Hi',
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${key}`,
          },
        }
      )
      localStorage.setItem('UD_apiKey', key)
      setApiKey(key)
      setIsEditingKey(false)
      toast.success('API key added successfully')
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          toast.error('Wrong API key')
        } else {
          toast.error('Opps! Something went wrong')
        }
      }
    }
    setIsSavingApiKey(false)
  }

  function handleSettingsInputChange(event: any) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    setSettingsForm({ ...settingsForm, ...{ [name]: value } })
  }

  return (
    <div className='space-y-2 py-6 pl-4 pr-6'>
      <div className='flex justify-end'>
        <button
          className='inline-flex items-center justify-center rounded-full border bg-white p-1 text-slate-600 shadow transition hover:text-slate-900'
          onClick={() => {
            setShowSettings(!showSettings)
          }}>
          {showSettings ? <IconCircleX /> : <IconSettings />}
        </button>
      </div>

      {showSettings && (
        <div className='max-h-[400px] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-md'>
          <div className='mb-2 text-sm text-slate-600'>{`Your API key is stored locally on your browser.`}</div>
          <div className='flex items-center gap-2'>
            <span className='text-stale-600'>
              <IconCircleKeyFilled />
            </span>
            {isEditingKey ? (
              <div className='flex flex-1 items-center gap-4'>
                <input
                  type='text'
                  className='w-full flex-auto outline-none'
                  placeholder='sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                  defaultValue={apiKey}
                  autoFocus
                  ref={apiKeyInputRef}
                />
                <div className='flex items-center gap-2'>
                  <ActionButton
                    text='Save'
                    displayText
                    onClick={handleBtnSaveApiKey}
                    loading={isSavingApiKey}
                  />
                  <ActionButton
                    variant='secondary'
                    text='Cancel'
                    displayText
                    onClick={() => setIsEditingKey(false)}
                  />
                </div>
              </div>
            ) : (
              <div className='flex flex-1 items-center justify-between'>
                <div>
                  {!apiKey ? (
                    <span className='font-mono text-sm'>API key is missing</span>
                  ) : (
                    <>
                      <span>&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;</span>
                      <span className='font-mono'>{apiKey.substring(apiKey.length - 5, apiKey.length)}</span>
                    </>
                  )}
                </div>
                <div className='flex items-center gap-2'>
                  <ActionButton
                    variant='secondary'
                    text={apiKey ? 'Edit' : 'Add new'}
                    displayText
                    onClick={() => {
                      setIsEditingKey(true)
                    }}
                  />
                  {apiKey && (
                    <ActionButton
                      variant='danger'
                      text='Remove'
                      displayText
                      onClick={() => {
                        setApiKey('')
                        localStorage.setItem('UD_apiKey', '')
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className='mt-3 border-t pt-3'>
            <div className='mb-4 text-sm font-medium text-slate-600'>Other settings</div>
            <div className='mb-2 flex items-center'>
              <label className='block min-w-[100px] text-sm text-slate-600'>Model</label>
              <select
                name='model'
                value={settingsForm.model}
                onChange={handleSettingsInputChange}
                className='min-w-[150px] rounded border border-slate-300 px-2 py-1 outline-none focus:border-slate-400'>
                <option value='gpt-3.5-turbo'>gpt-3.5-turbo</option>
                <option value='gpt-4'>gpt-4</option>
              </select>
            </div>
            <div className='flex items-center'>
              <label className='block min-w-[100px] text-sm text-slate-600'>Temperature</label>
              <input
                name='temperature'
                type='number'
                min='0'
                max='1'
                step='0.1'
                className='min-w-[150px] rounded border border-slate-300 px-2 py-1 outline-none focus:border-slate-400'
                value={settingsForm.temperature}
                onChange={handleSettingsInputChange}
              />
            </div>
          </div>
        </div>
      )}

      <div className='rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-md'>
        <div className='flex items-center gap-2'>
          {isLoading ? (
            <span className='inline-flex animate-spin text-slate-500'>
              <IconLoader size={20} />
            </span>
          ) : (
            <span className='text-orange-600'>
              <IconSparkles />
            </span>
          )}
          <input
            type='text'
            onKeyDown={handleMsgInputKeyDown}
            className='w-full outline-none'
            placeholder={`E.g: generate OAuth flow`}
          />
        </div>
      </div>
    </div>
  )
}

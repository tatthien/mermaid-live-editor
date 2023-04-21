import { Message, MessageRole } from '@/types'
import { Action } from '@radix-ui/react-toast'
import {
  IconSparkles,
  IconChevronDown,
  IconChevronUp,
  IconLoader,
  IconCircleKeyFilled,
  IconSettings,
  IconEdit,
} from '@tabler/icons-react'
import axios, { isAxiosError } from 'axios'
import { useState, KeyboardEvent, useRef, useEffect, ChangeEvent } from 'react'

import ActionButton from './ActionButton'

interface ChatGPTProps {
  onMessage: (value: string | undefined) => void
  content: string
}

export default function ChatGPT({ onMessage, content }: ChatGPTProps) {
  const apiKeyInputRef = useRef<HTMLInputElement>(null)
  const [showMessages, setShowMessages] = useState<boolean>()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditingKey, setIsEditingKey] = useState(false)
  const [isSavingApiKey, setIsSavingApiKey] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    const value = localStorage.getItem('UD_showSettings')
    const key = localStorage.getItem('UD_apiKey')
    if (value) {
      setShowMessages(value === 'true')
    }
    if (key) {
      setApiKey(key)
    }
  }, [])

  useEffect(() => {
    if (typeof showMessages !== 'undefined') {
      localStorage.setItem('UD_showSettings', String(showMessages))
    }
  }, [showMessages])

  useEffect(() => {
    setCode(content)
  }, [content])

  async function onSendMessage(event: KeyboardEvent<HTMLInputElement>) {
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
            model: 'gpt-3.5-turbo',
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
            temperature: 0.7,
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
        console.log(err)
      }
      setIsLoading(false)
    }
  }

  function onClickBtnShowMessages() {
    setShowMessages(!showMessages)
  }

  async function onSaveApiKey() {
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
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          alert('Wrong API key!')
        } else {
          alert('Opps! Something went wrong')
        }
      }
    }
    setIsSavingApiKey(false)
  }

  return (
    <div className='space-y-2 py-6 pl-4 pr-6'>
      <div className='flex justify-end'>
        <button
          className='inline-flex items-center justify-center rounded-full border bg-white p-1 text-slate-600 shadow transition hover:text-slate-900'
          onClick={onClickBtnShowMessages}>
          <IconSettings />
        </button>
      </div>

      {showMessages && (
        <div className='max-h-[400px] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-md'>
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
                  <ActionButton text='Save' displayText onClick={onSaveApiKey} loading={isSavingApiKey} />
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
                  {apiKey === '' ? (
                    <span className='font-mono text-sm'>API key is missing</span>
                  ) : (
                    <>
                      <span>&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;</span>
                      <span className='font-mono'>{apiKey.substring(apiKey.length - 5, apiKey.length)}</span>
                    </>
                  )}
                </div>
                <ActionButton
                  className='ml-4'
                  variant='secondary'
                  text={apiKey ? 'Edit' : 'Add new'}
                  displayText
                  onClick={() => {
                    setIsEditingKey(true)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className='rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-md'>
        <div className='flex items-center gap-2'>
          <span className='text-orange-600'>
            <IconSparkles />
          </span>
          <input
            type='text'
            onKeyDown={onSendMessage}
            className='w-full outline-none'
            placeholder={`What's in your mind?`}
          />
          {isLoading && (
            <span className='inline-flex animate-spin text-slate-500'>
              <IconLoader size={20} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

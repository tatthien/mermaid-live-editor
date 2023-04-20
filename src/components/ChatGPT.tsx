import { Message, MessageRole } from '@/types'
import {
  IconSparkles,
  IconChevronDown,
  IconChevronUp,
  IconLoader,
  IconCircleKeyFilled,
  IconSettings,
} from '@tabler/icons-react'
import axios from 'axios'
import { useState, KeyboardEvent, useRef, useEffect, ChangeEvent } from 'react'

interface ChatGPTProps {
  onMessage: (value: string | undefined) => void
  content: string
}

export default function ChatGPT({ onMessage, content }: ChatGPTProps) {
  const [showMessages, setShowMessages] = useState<boolean>()
  const [isLoading, setIsLoading] = useState(false)
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

  useEffect(() => {
    localStorage.setItem('UD_apiKey', String(apiKey))
  }, [apiKey])

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

  function onChangeApiKey(event: ChangeEvent<HTMLInputElement>) {
    setApiKey(event.currentTarget.value)
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
            <input
              type='password'
              onChange={onChangeApiKey}
              className='w-full outline-none'
              placeholder='sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
              value={apiKey}
            />
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

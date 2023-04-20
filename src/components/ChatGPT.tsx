import { Message, MessageRole } from '@/types'
import {
  IconSparkles,
  IconChevronDown,
  IconChevronUp,
  IconLoader,
  IconCircleKeyFilled,
} from '@tabler/icons-react'
import axios from 'axios'
import { useState, KeyboardEvent, useRef, useEffect, ChangeEvent } from 'react'

import MessageItem from './MessageItem'

interface ChatGPTProps {
  onMessage: (value: string | undefined) => void
  content: string
}

export default function ChatGPT({ onMessage, content }: ChatGPTProps) {
  const messageRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [showMessages, setShowMessages] = useState<boolean>()
  const [isLoading, setIsLoading] = useState(false)
  const [showKey, setShowKey] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    const value = window.localStorage.getItem('ud_show_chatgpt_messages')
    if (value) {
      setShowMessages(value === 'true')
    }
  }, [])

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (typeof showMessages !== 'undefined') {
      window.localStorage.setItem('ud_show_chatgpt_messages', String(showMessages))
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
      const newMessages = [...messages, { role: 'user', content: String(value) }]
      setMessages(newMessages)
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
          className='inline-flex items-center justify-center rounded-full border bg-white p-1 shadow'
          onClick={onClickBtnShowMessages}>
          {showMessages ? <IconChevronDown /> : <IconChevronUp />}
        </button>
      </div>
      {showMessages && (
        <div
          className='max-h-[400px] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-md'
          ref={messageRef}>
          <div className='space-y-4'>
            {messages.length > 0 ? (
              messages.map((msg, index) => <MessageItem message={msg} key={index} />)
            ) : (
              <div className='flex gap-2'>
                <span className='text-2xl'>🤖</span>
                <div className='flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1 text-sm'>
                  {`Let's ask me about diagrams`}
                </div>
              </div>
            )}
            {isLoading && (
              <div className='flex gap-2'>
                <span className='text-2xl'>🤖</span>
                <div className='flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1 text-sm'>
                  <span className='block h-2 w-2 animate-bounce rounded-full bg-orange-500'></span>
                  <span className='block h-2 w-2 animate-bounce rounded-full bg-orange-600'></span>
                  <span className='block h-2 w-2 animate-bounce rounded-full bg-orange-700'></span>
                </div>
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
          {!showKey && (
            <button
              onClick={() => {
                setShowKey(true)
              }}
              className='inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded border border-slate-200 bg-white px-1.5 py-1 text-sm font-medium text-slate-600 opacity-100 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring focus:ring-slate-300'>
              Show key
            </button>
          )}
        </div>
        {showKey && (
          <div className='mt-4 flex items-center gap-2'>
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
            <button
              onClick={() => {
                setShowKey(false)
              }}
              className='inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded border border-slate-200 bg-white px-1.5 py-1 text-sm font-medium text-slate-600 opacity-100 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring focus:ring-slate-300'>
              Hide key
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

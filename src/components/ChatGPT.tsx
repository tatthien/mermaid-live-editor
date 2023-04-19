import { Message, MessageRole } from '@/types'
import { IconSparkles, IconChevronDown, IconChevronUp, IconLoader } from '@tabler/icons-react'
import axios from 'axios'
import { useState, KeyboardEvent, useRef, useEffect } from 'react'

import MessageItem from './MessageItem'

interface ChatGPTProps {
  onMessage: (value: string | undefined) => void
}

export default function ChatGPT({ onMessage }: ChatGPTProps) {
  const messageRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [showMessages, setShowMessages] = useState<boolean>()
  const [isLoading, setIsLoading] = useState(false)

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

  async function onSendMessage(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      if (isLoading) return
      const value = event.currentTarget.value
      const newMessages = [...messages, { role: 'user', content: String(value) }]
      setMessages(newMessages)
      event.currentTarget.value = ''
      setIsLoading(true)
      try {
        const { data } = await axios.post('/api/magic', {
          messages: newMessages,
        })

        setMessages([...newMessages, { role: 'assistant', content: data.result }])

        // get plantuml code from the result
        const regex = /```(?:plantuml|)\n([\s\S]*?)```/
        const matches = data.result.match(regex)
        if (matches[1]) {
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
        </div>
      </div>
    </div>
  )
}

import { Message } from '@/types'
import cx from 'clsx'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

interface MessageProps {
  message: Message
}
export default function MessageItem({ message }: MessageProps) {
  const isHuman = message.role === 'user'
  const messageContentArr = message.content.split('explanation:')
  const explanation = messageContentArr[messageContentArr.length - 1].trim()
  return (
    <div className={cx('flex gap-2')}>
      <span className='text-2xl'>{isHuman ? '😎' : '🤖'}</span>
      <div
        className={cx(isHuman ? 'bg-blue-100' : 'bg-orange-100', 'rounded-lg px-3 py-2 text-sm')}
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(explanation)) }}></div>
    </div>
  )
}

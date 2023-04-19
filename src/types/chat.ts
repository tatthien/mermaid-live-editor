export type MessageRole = 'system' | 'user' | 'assistant'
export interface Message {
  role: string
  content: string
}
